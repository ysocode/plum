function r(){return r=Object.assign?Object.assign.bind():function(r){for(var t=1;t<arguments.length;t++){var e=arguments[t];for(var i in e)({}).hasOwnProperty.call(e,i)&&(r[i]=e[i])}return r},r.apply(null,arguments)}var t=/*#__PURE__*/function(){function r(r,t,e,i,n,s,o){this.name=r,this.uri=t,this.methods=e,this.parameters=i,this.missingParameters=[],this.bindings=n,this.incomingParameters=s||{},this.config=o}var t=r.prototype;return t.resolveRouteParameters=function(r){var t=this;return Object.entries(this.incomingParameters).forEach(function(e){var i=e[0],n=e[1];if(t.parameters.includes(i))if("object"!=typeof n)r=r.replace("{"+i+"}",n);else{var s=t.bindings[i];if(!s)throw new Error("Plum error: route '"+t.name+"' has no binding for parameter '"+i+"'.");r=r.replace("{"+i+"}",n[s])}else t.missingParameters.push(i)}),r},t.resolveMissingParameters=function(r){var t=this;return 0===this.missingParameters.length||this.missingParameters.forEach(function(e){var i=t.incomingParameters[e];if("object"==typeof i)throw new Error("Plum error: missing parameter '"+e+"' has an invalid value.");r.searchParams.append(e,i)}),r},t.compile=function(){var r=this.resolveRouteParameters(this.uri),t=new URL(r,this.config.url);return this.url=this.resolveMissingParameters(t),this},t.toString=function(){if(!this.url)throw new Error("Plum error: route '"+this.name+"' is not compiled.");return this.config.absolute?this.url.href:this.url.pathname+this.url.search+this.url.hash},r}(),e=/*#__PURE__*/function(){function e(t,e,i,n){void 0===i&&(i=!0),this.name=t,this.incomingParameters=e,this.config=n||"undefined"!=typeof plum?plum:globalThis.plum,this.config=r({},this.config,{absolute:i})}var i=e.prototype;return i.has=function(r){return this.config.routes.hasOwnProperty(r)},i.fetchRoute=function(){if(!this.has(this.name))throw new Error("Plum error: route '"+this.name+"' is not in the route list.");var r=this.config.routes[this.name];return new t(this.name,r.uri,r.methods,r.parameters||[],r.bindings||{},this.incomingParameters,{url:this.config.url,port:this.config.port,defaults:this.config.defaults,absolute:this.config.absolute})},e}();function i(r,t,i,n){var s=new e(r,t,i,n);return r||t||i||n?s.fetchRoute().compile().toString():{has:function(r){return s.has(r)}}}var n={install:function(r,t){function e(r,e,n,s){return void 0===s&&(s=t),i(r,e,n,s)}r.config.globalProperties.route=e,r.provide("route",e)}};export{n as PlumVue,i as route};
