<?php

namespace YSOCode\Plum;

readonly class BladeRouteGenerator
{
    public function __construct(
        private Plum $plum
    ) {}

    public function generate(): string
    {
        $plumAsJson = (string) $this->plum;

        return <<<HTML
            <script type="text/javascript">
                let plum = $plumAsJson;
            </script>
        HTML;
    }
}
