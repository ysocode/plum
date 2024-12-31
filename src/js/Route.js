export default class Route {
    /**
     * @param {String} name
     * @param {String} uri
     * @param {Array} methods
     * @param {Array} parameters
     * @param {Object} bindings
     * @param {Object} incomingParameters
     * @param {Object} config
     */
    constructor(name, uri, methods, parameters, bindings, incomingParameters, config) {
        this.name = name;
        this.uri = uri;
        this.methods = methods;
        this.parameters = parameters;
        this.missingParameters = [];
        this.bindings = bindings;
        this.incomingParameters = incomingParameters || {};
        this.config = config;
    }

    /**
     * @param {String}uri
     */
    resolveRouteParameters(uri) {
        Object.entries(this.incomingParameters).forEach(([ key, value]) => {
            if (!this.parameters.includes(key)) {
                this.missingParameters.push(key);

                return;
            }

            if (typeof value === 'object') {
                const binding = this.bindings[key];

                if (!binding) {
                    throw new Error(`Plum error: route '${this.name}' has no binding for parameter '${key}'.`);
                }

                uri = uri.replace(`{${key}}`, value[binding]);

                return;
            }

            uri = uri.replace(`{${key}}`, value);
        });

        return uri;
    }

    /**
     * @param {URL} url
     */
    resolveMissingParameters(url) {
        if (this.missingParameters.length === 0) {
            return url;
        }

        this.missingParameters.forEach(key => {
            const value = this.incomingParameters[key];

            if (typeof value === 'object') {
                throw new Error(`Plum error: missing parameter '${key}' has an invalid value.`);
            }

            url.searchParams.append(key, value);
        });

        return url;
    }

    compile() {
        const uriWithResolvedRouteParameters = this.resolveRouteParameters(this.uri);

        const url = new URL(uriWithResolvedRouteParameters, this.config.url);
        this.url = this.resolveMissingParameters(url);

        return this;
    }

    toString() {
        if (!this.url) {
            throw new Error(`Plum error: route '${this.name}' is not compiled.`);
        }

        if (!this.config.absolute) {
            return this.url.pathname + this.url.search + this.url.hash;
        }

        return this.url.href;
    }
}
