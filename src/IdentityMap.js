/**
 * The identity map that manages resources via priviledged methods that are the
 * only methods with access to a private resource map.
 */
core.Class('kanso.IdentityMap', {

    events: {
        RESOURCE_CREATED:   'RESOURCE_CREATED',
        RESOURCE_DESTROYED: 'RESOURCE_DESTROYED',
        RESOURCE_ADDED:     'RESOURCE_ADDED',
        RESOURCE_REMOVED:   'RESOURCE_REMOVED'
    },

    /**
     * Takes a @resourceCtor {Function} that is used as the constructor to
     * create new resources. Also accepts an @emitter {kokou.Emitter?} that
     * it can use to publish events.
     */
    construct: function (resourceCtor, emitter) {
        /** {=Map} Private map of resource instances. */
        var resourceMap = core.Main.createDict();

        /** {=Function} A resource constructor function. */
        this.__resourceCtor = resourceCtor;

        /** {=kokou.Emitter} Event emitter to publish events to. */
        this.__emitter = emitter || null;

        /** {=Object} */
        this.__events__ = core.Class.getEvents(kanso.IdentityMap);

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Priviledged methods that need to access the resource map.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /**
         * {kanso.Resource} Get a resource via its @id {String}.
         */
        this.get = function (id) {
            var resource = null;

            // If there is no id, return the default.
            if ( id === undefined ) {
                return resource;
            }

            // Convert the id to a string if it is not already a string.
            id += '';

            resource = resourceMap[id];

            /*
             * If there was no resource, we create a ghost object to allow the
             * system to proceed. Ghost objects are filled in later after their
             * data is populated.
             */
            if ( !resource ) {
                resource = this.__create(id);
                this.add(resource);
            }

            return resource;
        };

        /**
         * {Array[kanso.Resource]} Get a list of resources from an @ids {Array}.
         */
        this.getList = function (ids) {
            var resources = [];

            if ( jasy.Env.isSet('debug') ) {
                if ( !kokou.Type.isArray(ids) ) {
                    throw new Error('ids must be type array.');
                }
            }

            ids.forEach(function (id) {
                resources.push( this.get(id) );
            }, this);

            return resources;
        };

        /**
         * {Array[kanso.Resource]} Get all currently loaded resources.
         */
        this.getAll = function () {
            var resources = [];

            Object.keys(map).forEach(function (key) {
                resources.push( resourceMap[key] );
            });

            return resources;
        };

        /**
         * {Boolean} Whether or not the resource exists in the map.
         */
        this.exists = function (id) {
            return !!resourceMap[id + ''];
        };

        /**
         * {Boolean} Add a @resource {kanso.Resource} to the map.
         */
        this.add = function (resource) {
            // Make sure it is a string.
            var id = resource.get('id') + '';

            if ( this.exists(id) ) {
                if ( jasy.Env.isSet('debug') ) {
                    console.warn('Resource already exists: ' + id);
                }

                return false;
            }

            resourceMap[id] = resource;

            return true;
        };

        /**
         * {kanso.Resource} Remove a resource from the map by @id {String}.
         */
        this.remove = function (id) {
            var resource = null;

            id += '';

            if ( this.exists(id) ) {
                resource = resourceMap[id];
                delete resourceMap[id];

                if ( this.__emitter ) {
                    this.__emitter.emit( this.__events__.RESOURCE_REMOVED,
                        this.__createResourceRemovedEvent(resource) );
                }
            }

            return resource;
        };

        /**
         * Clears the map of all resources.
         */
        this.clear = function () {
            resourceMap = core.Main.createDict();
        };

        /**
         * {kanso.Resource} Create a new ghost(unpopulated) resource with the
         * given @id {String}.
         */
        this.__create = function (id) {
            var resource = null;

            id += '';

            resource = new this.__resourceCtor({ id: id });

            if ( this.__emitter ) {
                this.__emitter.emit( this.__events__.RESOURCE_CREATED,
                    this.__createResourceCreatedEvent(resource) );
            }

            return resource;
        };
    },

    members: {
        /**
         * {kokou.Emitter} Get the current emitter.
         */
        getEmitter: function () {
            return this.__emitter;
        },

        /**
         * Set the @mitter {kokou.Emitter} that will be used to publish events.
         */
        setEmitter: function (emitter) {
            this.__emitter = emitter;
        },

        /**
         * {Object} Use the @resource {kanso.Resource} to create an event.
         */
        __createResourceCreatedEvent: function (resource) {
            return this.__createEvent(this.__events__.RESOURCE_CREATED, resource);
        },

        /**
         * {Object} Use the @resource {kanso.Resource} to create an event.
         */
        __createResourceRemovedEvent: function (resource) {
            return this.__createEvent(this.__events__.RESOURCE_REMOVED, resource);
        },

        __createEvent: function (type, resource) {
            return {
                type: type,
                timestamp: +(new Date()),
                resource: resource
            };
        }
    }
});

