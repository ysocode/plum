import {describe, expect, it} from 'vitest';
import Route from "../../Route.js";
import {defaultPlum} from "../utils/sharedData.js";

describe('Route', function () {
    describe('compile()', function () {
        it('should compile route by making a URL object through the url attribute', function () {
            const routeName = 'home';
            const incomingParameters = {};

            const routeDefinitions = defaultPlum.routes[routeName];

            const absolute = true;

            const route = new Route(
                routeName,
                routeDefinitions.uri,
                routeDefinitions.methods,
                routeDefinitions.parameters,
                routeDefinitions.bindings,
                incomingParameters,
                {
                    'url': defaultPlum.url,
                    'port': defaultPlum.port,
                    'defaults': defaultPlum.defaults,
                    'absolute': absolute
                }
            );

            route.compile();

            expect(route.url).toEqual(new URL('https://plum.dev/'));
        })
    })
});


