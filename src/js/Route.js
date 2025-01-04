export default class Route {
    /**
     * @param {string} name
     * @param {string} uri
     * @param {array} methods
     * @param {array} parameters
     * @param {object} bindings
     * @param {object} incomingParameters
     * @param {object} config
     *
     * @return {this}
     */
    constructor(name, uri, methods, parameters, bindings, incomingParameters, config) {
        this.setName(name);
        this.setUri(uri);

        this.methods = methods || [];
        this.parameters = parameters || [];
        this.bindings = bindings || {};

        this.setParameters(incomingParameters || {});

        this.config = config || {};

        this.setUrl(this.config.url)

        this.missingParameters = [];
    }

    /**
     * @param {string} name
     *
     * @return {void}
     */
    setName(name) {
        if (typeof name != 'string') {
            throw new TypeError('The name parameter must be a string');
        }

        this.name = name;
    }

    /**
     * @param {string} uri
     *
     * @return {void}
     */
    setUri(uri) {
        if (typeof uri != 'string') {
            throw new TypeError('The uri parameter must be a string');
        }

        this.uri = uri === '/' ? '' : uri;
    }

    /**
     * @param url
     *
     * @return {void}
     */
    setUrl(url) {
        if (typeof url != 'string') {
            throw new TypeError('The url parameter must be a string');
        }

        this.url = new URL(url);
    }

    /**
     * @param {object} parameters
     *
     * @return {void}
     */
    setParameters(parameters) {
        if (typeof parameters != 'object') {
            throw new TypeError('The parameters parameter must be an object');
        }

        const {_query, _fragment, ...otherParameters} = parameters || {};

        this.queryParameters = _query || {};
        this.fragment = _fragment || null;
        this.incomingParameters = otherParameters || {};
    }

    /**
     * @param {string} key
     *
     * @return {string|null}
     */
    getBinding(key) {
        let binding = this.bindings[key];

        if (!binding) {
            return null;
        }

        return binding;
    }

    /**
     * @param {string} uri
     *
     * @return {string}
     */
    resolveRouteParameters(uri) {
        if (typeof uri != 'string') {
            throw new TypeError('The uri parameter must be a string');
        }

        Object.entries(this.config.defaults).forEach(([key, value]) => {

            if (typeof value === 'object') {
                const binding = this.getBinding(key);

                if (!binding) {
                    return;
                }

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
     * @param value
     *
     * @returns {Number}
     */
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
     *
     * @return {URL}
     */
    resolveMissingParameters(url) {
        if (typeof url != 'object') {
            throw new TypeError('The url parameter must be an object');
        }

        if (this.missingParameters.length < 1) {
            return url;
        }

        this.missingParameters.forEach(key => {
            const value = this.incomingParameters[key];

            if (typeof value === 'object') {
                throw new Error(`Plum error: missing parameter '${key}' has an invalid value.`);
            }

            url.searchParams.append(key, this.convertQueryParameters(value).toString());
        });

        return url;
    }

    /**
     * @param {URL} url
     *
     * @return {URL}
     */
    resolveQueryParameters(url) {
        if (typeof url != 'object') {
            throw new TypeError('The url parameter must be an object');
        }

        Object.entries(this.queryParameters).forEach(([key, value]) => {
            if (typeof value === 'object') {
                throw new Error(`Plum error: missing parameter '${key}' has an invalid value.`);
            }

            url.searchParams.append(key, this.convertQueryParameters(value).toString());
        });

        return url;
    }

    /**
     * @param {URL} url
     *
     * @return {URL}
     */
    resolveFragment(url) {
        if (!this.fragment) {
            return url;
        }

        url.hash = this.fragment;

        return url;
    }

    /**
     * @returns {Route}
     */
    compile() {
        this.url.pathname = this.resolveRouteParameters(this.uri);
        this.url = this.resolveMissingParameters(this.url);
        this.url = this.resolveQueryParameters(this.url);
        this.url = this.resolveFragment(this.url);

        return this;
    }

    /**
     * @returns {string}
     */
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
