/**
 * A resource object that contains data and the associated logic to operate on
 * it. It uses a key/value model and it can be serialized/deserialized to/from
 * JSON.
 */
core.Class('kanso.data.Resource', {
    /**
     * Create a generic resource from a @config {Object}.
     *   - @config.type {String}
     *   - @config.data {Map}
     */
    construct: function (config) {
        config = config || core.Main.createDict();
        kanso.data.Resource.count += 1;

        /** {=Boolean} True if the resource data object is initialized. */
        this.__isInit = false;

        /** {=Boolean} True if the data has been loaded from the data source. */
        this.__isLoaded = false;

        /** {=String} The config type. */
        this.__type = config.type || 'generic';

        /** {=Map} Child data container. */
        this._data = core.Main.createDict();

        if ( config.data ) {
            this.initData(config.data);
        }
    },

    members: {
        /**
         * {Boolean} Parses a @data {Map} and sets a map representing the
         * internal data for this resource. Returns true if it successfully
         * initialized the data, otherwise false.
         */
        initData: function (data) {
            var type = kokou.Type;
            var o = null;
            var keys = null;
            var idKey = 'id';

            if ( this.isInitialized() || !data || !type.isObject(data) ) {
                return false;
            }

            o = core.Main.createDict();
            keys = Object.keys(data);

            if ( keys.length < 1 ) {
                return false;
            }

            keys.forEach(function (key) {
                o[key] = data[key];
            });

            if ( !o[idKey] ) {
                o[idKey] = this.__type + kanso.data.Resource.count;
            }

            this._data = o;
            this.__isInit = true;

            return true;
        },

        /**
         * {String|Number|Integer|Array|Function|Map|Object} Set @name {String}
         * with @value {String|Number|Integer|Array|Function|Map|Object}. If the
         * new value is the same as the old value, nothing happens. If the value
         * changed it returns the old value, otherwise undefined.
         */
        set: function (name, value) {
            var currentVal = this._data[name];
            var expected;
            var actual;

            if ( jasy.Env.isSet('debug') ) {
                if ( !this._data[name] ) {
                    throw new Error(
                        "Tried to set invalid property '" + name + "'.");
                }
            }

            /*
             * Don't replace the value if it is the same, and don't replace it
             * if the value is specifically undefined.
             */
            if ( typeof value === 'object' ) {
                expected = JSON.stringify(currentVal);
                actual = JSON.stringify(value);

                if ( actual === expected ) {
                    // Do nothing.
                    return;
                }
            }
            else if ( currentVal === value || typeof value === 'undefined' ) {
                // Do nothing.
                return;
            }

            this._data[name] = value;

            return currentVal;
        },

        /**
         * {String} Return the specific type of this resource.
         */
        getType: function () {
            return this.__type;
        },

        /**
         * {Boolean} Whether or not the resource data has been initialized yet.
         */
        isInitialized: function () {
            return this.__isInit;
        },

        /**
         * {Boolean} Whether or not the real data has been loaded yet. If it is
         * false, consider this a ghost object that will be filled in later.
         */
        isLoaded: function () {
            return this.__isLoaded;
        },

        /**
         * {Boolean} Mark the resource as loaded. Return true if set to loaded,
         * otherwise it returns false, which means it was already loaded.
         */
        setLoaded: function () {
            if ( this.__isLoaded ) {
                return false;
            }

            this.__isLoaded = true;

            return true;
        },

        /**
         * Tell the resource that is should be terminated/destroyed. Executes
         * cleanup logic.
         */
        terminate: function () {
           // Override for resource-specific cleanup logic.
        },

        /**
         * {Map} Create a resource config from this resource.
         */
        toConfig: function () {
            return {
                type: this.__type,
                data: this._data
            };
        },

        /**
         * {String} Serialize this resource into JSON format.
         */
        toJSON: function () {
            return JSON.stringify( this.toConfig() );
        }
    }
});

core.Main.addStatics('kanso.data.Resource', {
    // Instance count.
    count: 0,

    // Static method to deserialize from JSON.
    fromJSON: function (txt) {
        var resource = null;
        var config = null;

        if ( typeof txt !== 'string' ) {
            return null;
        }

        config = JSON.parse(txt);
        resource = new this(config);
    }
});
