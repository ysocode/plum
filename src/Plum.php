<?php

namespace YSOCode\Plum;

use Illuminate\Contracts\Routing\UrlGenerator;
use Illuminate\Contracts\Routing\UrlRoutable;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Illuminate\Support\Collection;
use Illuminate\Support\Reflector;
use Illuminate\Support\Str;
use ReflectionException;

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
     * Resolves the route bindings for the given route.
     *
     * This method is necessary because the default "bindingFields" method
     * of the Route class does not automatically bind using the column binding
     * via the "getRouteKeyName" method.
     *
     * It checks the route's signature parameters, and for each parameter that
     * is bound to a model, it overrides the binding to use the model's
     * "getRouteKeyName" if applicable.
     *
     * @throws ReflectionException
     */
    private function resolveBindings(Route $route): array
    {
        $bindings = [];

        foreach ($route->signatureParameters(UrlRoutable::class) as $parameter) {
            if (! in_array($parameter->getName(), $route->parameterNames())) {
                break;
            }

            $model = Reflector::getParameterClassName($parameter);
            $bindings[$parameter->getName()] = app($model)->getRouteKeyName();
        }

        return [...$bindings, ...$route->bindingFields()];
    }

    /**
     * @throws ReflectionException
     */
    private function getNormalizedRoutes(): Collection
    {
        [$fallbacks, $routes] = collect($this->router->getRoutes()->getRoutesByName())
            ->reject(fn ($route) => Str::startsWith($route->getName(), 'generated::'))
            ->partition('isFallback');

        $fallbacks->each(fn ($route, $name) => $routes->put($name, $route));

        return $routes->map(
            fn ($route, $name) => collect($route)
                ->only(['uri', 'methods', 'wheres'])
                ->put('domain', $route->domain())
                ->put('parameters', $route->parameterNames())
                ->when(
                    $route->isFallback === false,
                    fn ($collection) => $collection->put('bindings', $this->resolveBindings($route) ?? []))
                ->when(
                    config('plum.middleware'),
                    fn ($collection, $middleware) => is_array($middleware)
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
