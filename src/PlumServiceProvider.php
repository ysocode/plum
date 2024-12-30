<?php

namespace YSOCode\Plum;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;

class PlumServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(RouteList::class, fn () => new RouteList($this->app->get('router')));
        $this->app->singleton(
            CompileRoutes::class,
            fn () => new CompileRoutes($this->app->get(RouteList::class))
        );
    }

    public function boot(): void
    {
        $this->registerBladeDirectives();
    }

    protected function registerBladeDirectives(): void
    {
        $this->callAfterResolving('blade.compiler', function (BladeCompiler $blade) {
            $blade->directive('plumRoutes', fn () => "<?php echo app('" . CompileRoutes::class . "')->generate(); ?>");
        });
    }
}
