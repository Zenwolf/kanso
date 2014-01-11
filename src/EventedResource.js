/**
 * A resource with events.
 */
core.Class('kanso.EventedResource', {

    include: [
        kanso.Resource,
        kokou.Emitter
    ],

    events: {
        PROPERTY_CHANGE: 'PROPERTY_CHANGE',
        DATA_LOADED:     'DATA_LOADED',
        TERMINATED:      'TERMINATED'
    },

    /**
     * Accepts the {kanso.Resource} @config {Map}.
     */
    construct: function (config) {
        kanso.Resource.call(this, config);
        kokou.Emitter.call(this);

        /** {=Object} */
        this.__events__ = core.Class.getEvents(kanso.EventedResource);
    },

    members: {
        /**
         * Override to allow an event to be fired after a property value is
         * changed. See {kanso.Resource#set}.
         */
        set: function (name, value) {
            var oldVal = kanso.Resource.prototype.set.call(this, name, value);

            if (oldVal) {
                this.emit( this.__events__.PROPERTY_CHANGE,
                    this.__createPropertyChangeEvent(name, oldVal, value) );
            }
        },

        /**
         * Override to allow an event to be fired after data is loaded.
         * See {kanso.Resource#setLoaded}.
         */
        setLoaded: function () {
            var wasSet = kanso.Resource.prototype.setLoaded.call(this);

            if (wasSet) {
                this.emit( this.__events__.DATA_LOADED,
                    this.__createDataLoadedEvent() );
            }
        },

        /**
         * Override to allow an event to be fired after data is loaded.
         * See {kanso.Resource#terminate}.
         */
        terminate: function () {
            this.emit(
                this.__events__.TERMINATED,
                this.__createTerminatedEvent() );

            this.clearListeners();
        },

        __createDataLoadedEvent: function () {
            return {
                type     : this.__events__.DATA_LOADED,
                timestamp: +(new Date()),
                resource : this
            };
        },

        __createPropertyChangeEvent: function (propName, oldVal, newVal) {
            return {
                type     : this.__events__.PROPERTY_CHANGE,
                timestamp: +(new Date()),
                propName : propName,
                oldVal   : oldVal,
                newVal   : newVal,
                resource : this
            };
        },

        __createTerminatedEvent: function () {
            return {
                type     : this.__events__.TERMINATED,
                timestamp: +(new Date()),
                resource : this
            };
        }
    }
});

core.Main.addStatics('kanso.EventedResource', {
    fromJSON: function (txt) {
        return kanso.Resource.fromJSON.call(this, txt);
    }
});
