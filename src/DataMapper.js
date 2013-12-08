/**
 * Finds resources and loads applicable data to populate the resource if necessary.
 */
core.Class('kanso.DataMapper', {

    events: {
        RESOURCES_LOADED : 'RESOURCES_LOADED',
        RESPONSE_ERROR   : 'RESPONSE_ERROR'
    },

    /**
     * Create a data mapper that finds resources in the @identityMap {kanso.IdentityMap} and
     * uses the @client {kanso.ServiceClient} to load data for the map's resources. It uses
     * the @emitter {kokou.Emitter?} to publish any events.
     */
    construct: function (identityMap, client, emitter) {

        /** {=kanso.IdentityMap} Holds all the resources. */
        this.__identityMap = identityMap;

        /** {=kanso.ServiceClient} Used to load data for the resources. */
        this.__client = client;

        /** {=kokou.Emitter} The event emitter used to publish events. */
        this.__emitter = emitter || null;

        /** {=Function} Function that converts raw response into a list of raw resource objects. */
        this.__dataParser = null;

        /** {=Function} Function that converts a raw resource into a {kanso.Resource}. */
        this.__resourceParser = null;

        /** {=Function} Response error handler, a NOOP by default. */
        this.__handleError = function () {};

    },

    members: {

        /**
         * {Array[kanso.Resource]} Find resources by the @ids {Array[String]|String}. Get them from
         * the identity map and then load remote data if necessary. If a resource is requested that
         * is not in the identity map, it will construct a ghost resource with the id and return it,
         * and asynchronously make a remote call to load the data and populate it after the response
         * returns. The resource will be populated and its DATA_LOADED event will fire. Since
         * the caller would already have a reference to the resource, it can check to see if the
         * data is loaded and if not, assign a listener for that event.
         */
        find: function (ids) {
            var type = kokou.Type;
            var resources = [];
            var ghosts = [];

            if ( jasy.Env.isSet('debug') ) {
                if ( !type.isArray(ids) ) {
                    throw new Error("'ids' must be an array.");
                }
            }

            ids.forEach(function (id) {
                var user = this.__identityMap.get(id);

                resources.push(user);

                if ( !user.isLoaded() ) {
                    ghosts.push(user);
                }
            }, this);

            if ( ghosts.length > 0 ) {
                this.__client.get(
                    ghosts,
                    this.__handleLoad.bind(this),
                    this.__handleError);
            }

            return resources;
        },

        /**
         * Call this to load all resources from the remote service.
         * Nothing will be immediately returned, and the @callback {Function} will be called
         * when the results are returned. The callback will be passed an Array of the resources.
         */
        loadAll: function (callback) {
            this.__client.getAll(
                this.__handleLoad.bind(this, callback),
                this.__handleError);
        },

        /**
         * {kanso.Resource} Gets a resource from the identity map for the @id {String}. If none
         * exists, it will return a ghost with the requested id but DOES NOT make a remote service
         * call to load data. Use #find for that.
         */
        get: function (id) {
            if ( jasy.Env.isSet('debug') ) {
                if ( typeof id !== 'string' ) {
                    throw new Error('"id" must be a string.');
                }
            }

            return this.__identityMap.get(id);
        },

        /**
         * {Array[kanso.Resource]} Returns the currently loaded resources without making
         * a service call.
         */
        getCurrent: function () {
            return this.__identityMap.getAll();
        },

        /**
         * {Boolean} Add a @resource {kanso.Resource}. If it already exists, it will NOT
         * replace it and will return false. If you want it, then call #find or #get. If
         * it doesn't exist, it will add it and return true.
         */
        add: function (resource) {
            return this.__identityMap.add(resource);
        },

        /**
         * {Boolean} Remove a resource with the @id {String}. Returns true if it was successfully
         * removed. If removed, the resource will be told to terminate. If it was not removed,
         * it returns false.
         */
        remove: function (id) {
            var resource = this.__identityMap.remove(id);

            if ( resource ) {
                resource.terminate();
                return true;
            }

            return false;
        },

        /**
         * Clears the resources.
         */
        clear: function () {
            return this.__identityMap.clear();
        },

        /**
         * Set the service response error @handler {Function}.
         */
        setErrorHandler: function (handler) {
            this.__handleError = handler;
        },

        /**
         * Set the resource @parser {Function} that must return a single instance of the
         * resource created from the expected raw data.
         */
        setResourceParser: function (parser) {
            if ( jasy.Env.isSet('debug') ) {
                if ( typeof parser !== 'function' ) {
                    throw new Error( 'resource parser must be a function.' );
                }
            }

            this.__resourceParser = parser;
        },

        /**
         * Set the @parser {Function} that parses the raw response and returns a list
         * of the raw resource data objects that will each be consumed by the resource parser
         * and transformed into full {kanso.Resource} objects.
         */
        setDataParser: function (parser) {
            if ( jasy.Env.isSet('debug') ) {
                if ( typeof parser !== 'function' ) {
                    throw new Error( 'data parser must be a function.' );
                }
            }

            this.__dataParser = parser;
        },

        /**
         * Handle the load of resource @data {Array[Object]}. If a @callback {Function} is
         * provided, pass the resources to the callback.
         */
        __handleLoad: function (data, callback) {
            var rawResources = this.__dataParser(data);
            var resources = [];
            var newResourcesLoaded = [];
            var evt = null;

            rawResources.forEach(function (rawResource) {
                var resource = this.__resourceParser(rawResource);

                if ( resource ) {
                    resources.push( resource );
                }
            }, this);

            resources.forEach(function (resource) {
                // TODO make sure stuff is set in the identity map
                // this.__identityMap;

                if ( !resource.isLoaded() ) {
                    resource.setLoaded();
                    newResourcesLoaded.push( resource );
                }
            });

            if ( this.__emitter && newResourcesLoaded.length > 0 ) {
                evt = this.__createResourcesLoadedEvent(newResourcesLoaded, []);
                this.__dispatch(evt);
            }

            if ( callback ) {
                callback(resources);
            }
        },

        __dispatch: function (evt) {
            this.__emitter.emit(evt.type, evt);
        }
    }
});
