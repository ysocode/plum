<?php

namespace YSOCode\Plum;

use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Illuminate\Support\Collection;

class RouteList
{
    public function __construct(
        protected Router $router
    ) {}

    public function handle(): Collection
    {
        return $this->getRoutes();
    }

    protected function getRouteInformation(Route $route)
    {
        return [
            'uri' => $route->uri(),
            'methods' => $route->methods(),
            'parameters' => $route->parameterNames(),
        ];
    }

    protected function getRoutes(): Collection
    {
        return new Collection($this->router->getRoutes())
            ->filter(fn (Route $route) => $route->getName())
            ->mapWithKeys(fn (Route $route) => [$route->getName() => $this->getRouteInformation($route)]);
    }
}
