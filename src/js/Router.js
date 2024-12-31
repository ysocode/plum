import Route from './Route.js';

export default class Router {
    /**
     * @param {String} name
     * @param {Object} incomingParameters
     * @param {Boolean} absolute
     * @param {Object} config
     */
    constructor(name, incomingParameters, absolute = true, config) {
        this.name = name;
        this.incomingParameters = incomingParameters;

        this.config = config || typeof plum !== 'undefined' ? plum : globalThis.plum;
        this.config = {...this.config, absolute};
    }

    fetchRoute() {
        if (!this.config.routes[this.name]) {
            throw new Error(`Plum error: route '${this.name}' is not in the route list.`);
        }

        const routeDefinition = this.config.routes[this.name];

        return new Route(
            this.name,
            routeDefinition.uri,
            routeDefinition.methods,
            routeDefinition.parameters || [],
            routeDefinition.bindings || {},
            this.incomingParameters,
            {
                'url': this.config.url,
                'port': this.config.port,
                'defaults': this.config.defaults,
                'absolute': this.config.absolute
            }
        );
    }
}