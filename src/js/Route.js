export default class Route {
    /**
     * @param {Object} parameters
     */
    setParameters(parameters) {
        const {_query, ...otherParameters} = parameters || {};

        this.queryParameters = _query || {};
        this.incomingParameters = otherParameters || {};
    }

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
        this.name = name || null;
        this.uri = uri || null;
        this.methods = methods || [];
        this.parameters = parameters || [];
        this.missingParameters = [];
        this.bindings = bindings || {};
        this.config = config || {};

        this.setParameters(incomingParameters || {});
    }

    /**
     * @param {String} key
     * @param {Boolean} throwError
     */
    getBinding(key, throwError = true) {
        let binding = this.bindings[key];

        if (!binding) {
            if (!throwError) {
                return null;
            }

            throw new Error(`Plum error: route '${this.name}' has no binding for parameter '${key}'.`);
        }

        return binding;
    }

    /**
     * @param {String} uri
     */
    resolveRouteParameters(uri) {
        Object.entries(this.config.defaults).forEach(([key, value]) => {

            if (typeof value === 'object') {
                const binding = this.getBinding(key, false);

                if (!binding) { return; }

                uri = uri.replace(`{${key}}`, value[binding]);

                return;
            }

            uri = uri.replace(`{${key}}`, value);
        });

        Object.entries(this.incomingParameters).forEach(([key, value]) => {
            if (!this.parameters.includes(key) && !this.config.defaults.hasOwnProperty(key)) {
                this.missingParameters.push(key);

                return;
            }

            if (typeof value === 'object') {
                let binding = this.getBinding(key)

                uri = uri.replace(`{${key}}`, value[binding]);

                return;
            }

            uri = uri.replace(`{${key}}`, value);
        });

        return uri;
    }

    convertQueryParameters(value) {
        const conversions = {
            boolean: value => value ? 1 : 0,
        }

        const valueType = typeof value;
        const conversion = conversions[valueType];

        if (!conversion) {
            return value;
        }

        return conversion(value);
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

            url.searchParams.append(key, this.convertQueryParameters(value));
        });

        return url;
    }

    /**
     * @param {URL} url
     */
    resolveQueryParameters(url) {
        Object.entries(this.queryParameters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                throw new Error(`Plum error: missing parameter '${key}' has an invalid value.`);
            }

            url.searchParams.append(key, this.convertQueryParameters(value));
        });

        return url;
    }

    compile() {
        const uriWithResolvedRouteParameters = this.resolveRouteParameters(this.uri);

        this.url = new URL(uriWithResolvedRouteParameters, this.config.url);

        this.url = this.resolveMissingParameters(this.url);
        this.url = this.resolveQueryParameters(this.url);

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
