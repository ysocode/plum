import {describe, expect, it} from 'vitest';
import Route from "../../Route.js";
import {defaultPlum} from "../utils/sharedData.js";

/**
 * @returns {Route}
 */
function createRoute() {
    const routeName = 'home';
    const incomingParameters = {};

    const routeDefinitions = defaultPlum.routes[routeName];

    const absolute = true;

    return new Route(
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
}

describe('Route', function () {
    describe('compile()', function () {
        it('should compile a Route by making a URL object through the url attribute', function () {
            const route = createRoute();

            route.compile();

            expect(route.url).toEqual(new URL('https://plum.dev/'));
        });

        it('should compile a Route and return itself', function () {
            const route = createRoute();

            expect(route.compile()).toEqual(route);
        });
    });

    describe('toString()', function () {
        it('should return a Route string representation when a Route is compiled', function () {
            const compiledRouteAsString = createRoute()
                .compile()
                .toString();

            expect(compiledRouteAsString).toEqual('https://plum.dev/');
        });

        it('should throw an Error when a Route is not compiled', function () {
            const route = createRoute();

            expect(() => route.toString()).toThrowError("Plum error: route 'home' is not compiled");
        });
    });
});
