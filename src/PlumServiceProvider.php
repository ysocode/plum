<?php

namespace YSOCode\Plum;

use Illuminate\Support\ServiceProvider;
use Illuminate\View\Compilers\BladeCompiler;

class PlumServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(Plum::class, fn () => new Plum($this->app->get('router')));
        $this->app->singleton(
            BladeRouteGenerator::class,
            fn () => new BladeRouteGenerator($this->app->get(Plum::class))
        );
    }

    public function boot(): void
    {
        $this->registerBladeDirectives();
    }

    protected function registerBladeDirectives(): void
    {
        $this->callAfterResolving('blade.compiler', function (BladeCompiler $blade) {
            $blade->directive('plumRoutes', fn () => "<?php echo app('".BladeRouteGenerator::class."')->generate(); ?>");
        });
    }
}
