import Route from './Route.js';

export default class Router {
    /**
     * @param {string} url
     * @param {number} port
     * @param {object} defaults
     * @param {object} routes
     *
     * @return {this}
     */
    constructor(url, port, defaults, routes) {
        this.setUrl(url)
        this.setPort(port)

        this.defaults = defaults || {};
        this.routes = routes || {};
    }

    /**
     * @param {string} url
     *
     * @return {void}
     */
    setUrl(url) {
        if (typeof url != 'string') {
            throw new TypeError('The url parameter must be a string');
        }

        this.url = url;
    }

    /**
     * @param {number} port
     *
     * @return {void}
     */
    setPort(port) {
        if (typeof port != 'number') {
            throw new TypeError('The port parameter must be a number');
        }

        this.port = port;
    }

    /**
     * @param {string} name
     *
     * @return {boolean}
     */
    has(name) {
        return this.routes.hasOwnProperty(name);
    }

    /**
     * @param {string} name
     * @param {object} incomingParameters
     * @param {boolean} absolute
     *
     * @return {Route}
     */
    fetchRoute(name, incomingParameters = {}, absolute = true) {
        if (!this.has(name)) {
            throw new Error(`Plum error: route '${name}' is not in the route list.`);
        }

        const routeDefinitions = this.routes[name];

        return new Route(
            name,
            routeDefinitions.uri,
            routeDefinitions.methods,
            routeDefinitions.parameters,
            routeDefinitions.bindings,
            incomingParameters,
            {
                'url': this.url,
                'port': this.port,
                'defaults': this.defaults,
                'absolute': absolute
            }
        );
    }
}
