import Router from './Router.js';

export function route(name, incomingParameters, absolute, config) {
    const router = new Router(name, incomingParameters, absolute, config);
    return router.fetchRoute()
        .compile()
        .toString();
}

export const PlumVue = {
    install(app, options) {
        function r(name, incomingParameters, absolute, config = options) {
            return route(name, incomingParameters, absolute, config);
        }

        app.config.globalProperties.route = r;
        app.provide('route', r);
    },
};
