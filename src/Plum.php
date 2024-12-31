<?php

namespace YSOCode\Plum;

use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\Routing\UrlRoutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Routing\Router;
use Illuminate\Support\Collection;
use Illuminate\Support\Reflector;
use Illuminate\Support\Str;
use ReflectionClass;
use ReflectionException;
use ReflectionMethod;
use ReflectionProperty;

readonly class Plum
{
    private UrlGenerator $url;

    private Collection $routes;

    /**
     * @throws ReflectionException
     */
    public function __construct(
        private Router $router
    ) {
        $this->url = url();
        $this->routes = $this->getNormalizedRoutes();
    }

    /**
     * @throws ReflectionException
     */
    private function resolveBindings(array $routes): array
    {
        foreach ($routes as $name => $route) {
            $bindings = [];

            foreach ($route->signatureParameters(UrlRoutable::class) as $parameter) {
                if (! in_array($parameter->getName(), $route->parameterNames())) {
                    break;
                }

                $model = Reflector::getParameterClassName($parameter);

                $override = new ReflectionClass($model)->isInstantiable() && (
                    new ReflectionMethod($model, 'getRouteKeyName')->class !== Model::class
                    || new ReflectionMethod($model, 'getKeyName')->class !== Model::class
                    || new ReflectionProperty($model, 'primaryKey')->class !== Model::class
                );

                // Avoid booting this model if it doesn't override the default route key name
                $bindings[$parameter->getName()] = $override ? app($model)->getRouteKeyName() : 'id';
            }

            $routes[$name] = [...$bindings, ...$route->bindingFields()];
        }

        return $routes;
    }

    /**
     * @throws ReflectionException
     */
    private function getNormalizedRoutes(): Collection
    {
        [$fallbacks, $routes] = collect($this->router->getRoutes()->getRoutesByName())
            ->reject(fn ($route) => Str::startsWith($route->getName(), 'generated::'))
            ->partition('isFallback');

        $bindings = $this->resolveBindings($routes->toArray());

        $fallbacks->each(fn ($route, $name) => $routes->put($name, $route));

        return $routes->map(
            fn ($route, $name) => collect($route)
                ->only(['uri', 'methods', 'wheres'])
                ->put('domain', $route->domain())
                ->put('parameters', $route->parameterNames())
                ->put('bindings', $bindings[$route->getName()] ?? [])
                ->when(config('plum.middleware'), fn ($collection, $middleware) => is_array($middleware)
                    ? $collection->put('middleware', collect($route->middleware())->intersect($middleware)->values()->all())
                    : $collection->put('middleware', $route->middleware()),
                )
                ->filter()
        );
    }

    public function toArray(): array
    {
        $url = $this->url->to('');

        return [
            'url' => $url,
            'port' => parse_url($url, PHP_URL_PORT) ?? null,
            'defaults' => $this->url->getDefaultParameters(),
            'routes' => $this->routes->toArray(),
        ];
    }

    private function toJson(): string
    {
        return json_encode($this->toArray());
    }

    public function __toString()
    {
        return $this->toJson();
    }
}
