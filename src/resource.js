// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

define(function () {

    var module        = {};
    var resource      = {};
    var resourceCount = 0;


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Resource mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asResource = (function () {
        /*
         * Init the object with expected properties. You can pass in an optional
         * config object:
         *
         * config.type {String} Resource type.
         * config.vals {Object} Key/val map.
         */
        function initResource(config) {
            config = config || {};

            this.data = this.data || {};

            if ( this.data.isInit ) { return this; }

            this.data.isInit   = false;
            this.data.isLoaded = false;
            this.data.type     = config.type || 'generic';
            this.data.vals     = {};

            /*
             * Parses a data object and returns a map representing
             * the internal property values for this resource.
             */
            if ( config.vals ) {
                Object.keys(config.vals).forEach( function (key) {
                    this.data.vals[key] = config.vals[key];
                }, this);
            }

            if ( !this.data.vals['id'] ) {
                this.data.vals['id'] = this.data.type + resourceCount;
            }

            this.data.isInit = true;

            return this;
        }

        /*
         * Get a value by property name.
         */
        function get(name) {
            return this.data.vals[name];
        }

        /*
         * Set the value of a property.
         * If the new value is the same as the old value, nothing happens.
         * If valued is changed it returns old value, otherwise undefined.
         */
        function set(name, value) {
            var vals = this.data.vals;
            var currentVal = vals[name];

            /*
             * Don't replace the value if it is the same, and don't replace
             * it if the value is specifically undefined.
             */
            if ( currentVal === value || typeof value === 'undefined' ) {
                return; // do nothing
            }

            vals[name] = value;

            return currentVal; // Return the previous value.
        }

        /*
         * Return the specific type of this resource.
         */
        function getType() {
            return this.data.type;
        }

        /*
         * Whether or not the resource data has been initialized yet.
         */
        function isInitialized() {
            return this.data.isInit;
        }

        /*
         * Whether or not the real data has been loaded yet.
         * If it is false, consider this a ghost object that can be
         * filled in later.
         */
        function isLoaded() {
            return this.data.isLoaded;
        }

        /*
         * Mark the resource as loaded. Return true if set to loaded,
         * otherwise returns false (false means it was already loaded).
         */
        function setLoaded() {
            if (this.data.isLoaded) { return false; }
            return this.data.isLoaded = true;
        }

        /*
         * This should be called when the resource is no longer used.
         */
        function terminate() {
            // Override for specific cleanup logic.
        }

        function toJSON() {
            return JSON.stringify({
                type: this.data.type,
                vals: this.data.vals
            });
        }

        return function () {
            this.initResource  = initResource;
            this.get           = get;
            this.set           = set;
            this.getType       = getType;
            this.isInitialized = isInitialized;
            this.isLoaded      = isLoaded;
            this.setLoaded     = setLoaded;
            this.terminate     = terminate;
            this.toJSON        = toJSON;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototype object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asResource.call(resource);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        var obj = null;

        resourceCount += 1;
        obj = Object.create(resource);
        config = ( typeof config === 'object' ) ? config : null;

        if ( config !== null ) {
            obj.initResource(config);
        }

        return obj;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // JSON deserialization.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function fromJSON(json) {
        var resource = null;
        var config   = null;

        if ( typeof json !== 'string' ) { return null; }

        config   = JSON.parse(json);
        resource = create(config);

        return resource;
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create     = create;
    module.asResource = asResource;
    module.fromJSON   = fromJSON;

    return module;
});
