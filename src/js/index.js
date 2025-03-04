import Router from './Router.js';

/**
 * @param {string} name
 * @param {object} incomingParameters
 * @param {boolean} absolute
 *
 * @returns {string|{has: (function(string): boolean)}}
 */
export function route(name, incomingParameters = {}, absolute = true) {
    const config = (typeof ysoCodePlum !== 'undefined' ? ysoCodePlum : globalThis.ysoCodePlum) || null;

    if (typeof config != 'object') {
        throw new Error('Unable to find Plum');
    }

    const router = new Router(config.url, parseInt(config.port), config.defaults, config.routes);

    if (!name && !incomingParameters && !absolute) {
        return {
            has: (name) => router.has(name)
        }
    }

    return router.fetchRoute(name, incomingParameters, absolute)
        .compile()
        .toString();
}

export const PlumVue = {
    install(app) {
        /**
         * @param {string} name
         * @param {object} incomingParameters
         * @param {boolean} absolute
         *
         * @returns {string|{has: (function(string): boolean)}}
         */
        function r(name, incomingParameters, absolute) {
            return route(name, incomingParameters, absolute);
        }

        app.config.globalProperties.route = r;
        app.provide('route', r);
    },
};
