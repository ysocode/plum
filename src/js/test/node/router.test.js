import {describe, expect, it} from 'vitest';
import Router from "../../Router.js";
import Route from "../../Route.js";
import {defaultPlum} from "../utils/sharedData.js";

function createRouter() {
    return new Router(
        defaultPlum.url,
        parseInt(defaultPlum.port),
        defaultPlum.defaults,
        defaultPlum.routes
    );
}

describe('Router', function () {
    describe('fetchRoute()', function () {
        it('should be able to return a Route object when given a route name', function () {
            const routeName = 'posts.index';
            const incomingParameters = {};
            const absolute = true;

            const router = createRouter();
            const route = router.fetchRoute(routeName, incomingParameters, absolute);

            const expectedRouteDefinitions = defaultPlum.routes[routeName];

            const expectedRoute = new Route(
                routeName,
                expectedRouteDefinitions.uri,
                expectedRouteDefinitions.methods,
                expectedRouteDefinitions.parameters,
                expectedRouteDefinitions.bindings,
                incomingParameters,
                {
                    'url': defaultPlum.url,
                    'port': parseInt(defaultPlum.port),
                    'defaults': defaultPlum.defaults,
                    'absolute': absolute
                }
            );

            expect(route).toEqual(expectedRoute);
        });

        it('should throw an Error when the given route name is not exists', function () {
            const router = createRouter();

            expect(() => router.fetchRoute('neida'))
                .toThrowError("Plum error: route 'neida' is not in the route list.");
        })
    });

    describe('has()', function () {
        it('should return true when Route exists', function () {
            const router = createRouter();

            expect(router.has('posts.index')).toBe(true);
        });

        it('should return false when Route not exists', function () {
            const router = createRouter();

            expect(router.has('neida')).toBe(false);
        });
    });
});
