/*
 * The identity map is a special kind of object that relies on a private map
 * with privileged methods to secure the resource instances.
 */
define(function () {

    var module = {};

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function initIMap(config) {
        config = config || {};
        this.data = this.data || {};
        this.data.resourceCtor = config.resourceCtor || null;
    }

    /*
     * config.resourceCtor {Function} Resource creation function.
     */
    function create(config) {
        var obj = {};
        var map = {};

        initIMap.call(obj, config);

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Privileged methods.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /*
         * Get resource by id.
         */
        obj.get = function (id) {
            var resource = map[id] || null;

            if (resource) {
                return resource;
            }

            if ( typeof id !== 'string' ) {
                id += ''; // convert to string
            }

            // Just return a ghost object for now.
            resource = this.create(id);
            this.add(resource);
            return resource;
        };

        /*
         * Get a list of resources from an array of ids.
         */
        obj.getList = function (ids) {
            var resources = [];

            ids.forEach(function (id) {
                var resource = this.get(id);
                resources.push(resource);
            }, this);

            return resources;
        };

        /*
         * Get all resources.
         */
        obj.getAll = function () {
            var resources = [];

            Object.keys(map).forEach(function (key) {
                resources.push( map[key] );
            });

            return resources;
        };

        /*
         * Whether or not the resource exists in the map.
         */
        obj.exists = function (id) {
            return !!map[id];
        };

        /*
         * Create a new empty resource using the resource creator function.
         */
        obj.create = function (id) {
            var resource = this.data.resourceCtor({ id: id });
            return resource;
        };

        /**
         * Add a resource to the map.
         */
        obj.add = function (resource) {
            var id = resource.get('id');

            if ( this.exists(id) ) {
                return false;
            }

            map[id] = resource;

            return true;
        };

        /**
         * Remove a resource by id from the map.
         */
        obj.remove = function (id) {
            var resource = null;

            if ( this.exists(key) ) {
                resource = map[key];
                delete map[key];
            }

            return resource;
        };

        obj.clear = function () {
            map = {};
        };

        return obj;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create = create;

    return module;
});
