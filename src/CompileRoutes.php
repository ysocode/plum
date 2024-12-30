<?php

namespace YSOCode\Plum;

class CompileRoutes
{
    public function __construct(
        protected RouteList $routeList
    ) {}

    public function generate()
    {
        $routeListCollection = $this->routeList->handle();

        $routeListAsJson = $routeListCollection->toJson();

        return <<<HTML
            <script type="text/javascript">
                let plumRoutes = $routeListAsJson;
            </script>
        HTML;
    }
}
