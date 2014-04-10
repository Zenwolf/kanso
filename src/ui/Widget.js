/**
 * A Widget is a Presenter that encapsulates the UI logic. It receives
 * messages from the View about the user interaction. The Widget decides
 * what to do about the messages, how to update any related data, and when to
 * update and render the view.
 */
core.Class('kanso.ui.Widget', {

    include: [kokou.Emitter],

    /**
     * The widget constructor, which takes the @parentId {String}, and
     * a @config {Object}.
     *
     * @config.id {String}
     * @config.props {Map}
     * @config.stateHistoryMax {integer}
     */
    construct: function(parentId, config) {
        config = config || Object.create(null);

        kokou.Emitter.call(this);


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Protected properties that are used by private WidgetState.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /** {=Map[string, any]} */
        this._props = config.props || Object.create(null);

        /** {=Map[string, any]} */
        this._state = config.state || Object.create(null);

        /** {=View} */
        this._currentView = null;


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Private properties.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /** {=integer} */
        this.__instanceNum = (this.constructor.count += 1);

        /** {=string} */
        this.__id = config.id || this.__createID();

        /** {=Map[string, WidgetState]} */
        this.__states = Object.create(null);

        /** {=WidgetState} */
        this.__currentState = null;

        /** {=Map[string, View]} */
        this.__views = Object.create(null);

        /** {=StateHistory[]} */
        this.__stateHistory = [];

        /** {=integer} */
        this.__stateHistoryMax = (kokou.Type.isNumber(config.stateHistoryMax)) ?
            config.stateHistoryMax : 10;
    },

    members: {

        handlers: {},

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Lifecycle methods
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /**
         * Establish the initial state of the widget and the initial UI
         * property values.
         */
        initialize: function () {
            this.__currentState.initialize(this);
        },

        beforeRender: function() {
            this.__currentState.beforeRender(this);
        },

        /**
         * {Boolean} Tell the widget to render. Returns true if it rendered,
         * otherwise false.
         */
        render: function () {
            this.__currentState.render(this);
        },

        afterRender: function () {
            this.__currentState.afterRender(this);
        },

        bindEvents: function() {
            this.__currentState.bindEvents(this);
        },

        unbindEvents: function() {
            this.__currentState.unbindEvents(this);
        },

        /**
         * {Boolean} Tell the widget to destroy. Returns true if it destroyed,
         * otherwise false.
         */
        destroy: function () {
            this.__currentState.destroy(this);
        },

        /**
         * Establish the final state of the widget.
         */
        terminate: function () {
            this.__currentState.terminate(this);
        },

        getDefaultProps: function () {
            return {};
        },

        // TODO clone all props to prevent change.
        // TODO enforce state history max.
        setProps: function (newProps) {
            var history = new StateHistory({
                stateName: this.__currentState.getName(),
                props: this.__props,
                state: this.__state
            });

            this.__props = this.__mergeProps(newProps);
            this.__stateHistory.push(history);
        },

        getStateHistory: function () {
            return this.__stateHistory.slice();
        },

        /**
         * Set the @nextStateName {string}.
         */
        setState: function (nextStateName) {
            var currentState = this.__currentState;
            var nextState = this.__states[nextStateName];

            currentState.exit(nextStateName);
            nextState.enter( currentState.getName() );

            this.__currentState = nextState;
        },

        /**
         * {String} Get the widget's unique ID.
         */
        getId: function () {
            return this.__id;
        },

        /**
         * {String} Get the widget's type.
         */
        getType: function () {
            return this.constructor.type;
        },

        getDOMNode: function () {
            return this.__currentView.getDOMNode();
        },

        /**
         * {kanso.ui.View} Get a widget view by @id {String}.
         */
        __getView: function (viewId) {
            return this.__views[viewId];
        },

        /**
         * Add a @view {kanso.ui.View} on the widget. The view will be stored
         * and referenced by its unique ID.
         */
        __addView: function (view) {
            this.__views[ view.getId() ] = view;
        },

        /**
         * {kanso.ui.View}
         */
        __removeView: function (viewId) {
            var view = this.__views[viewId];

            if (this.__currentView === view) {
                view.
            }

            delete this.__views[viewId];

            return view;
        },

        __selectView: function (viewId) {
            var nextView = this.__views[viewId];
            var currentView = this.__currentView;

            if (currentView !== null) {
                currentView.destroy();
            }

            this.__currentView = nextView;
        },

        __createID: function () {
            return this.getType() + '-' + this.__instanceNum;
        },

        /**
         * Merge old and new props together. Only respond and update known
         * properties that changed. Known properties are established by the
         * initial properties returned from #initialize and #getDefaultProps.
         */
        __mergeProps: function (oldProps, newProps) {
            // TODO
        },

        __handleViewEvent: function (eventName, arg1, arg2, arg3, arg4, arg5) {
            var handler = this.handlers[eventName];

            if (handler) {
                handler.call(this, arg1, arg2, arg3, arg4, arg5);
            }
        },

        __bindViewHandler: function () {
            this._currentView.addListener('*', this.__handleViewEvent, this);
        },

        __ unbindViewHandler: function () {
            this._currentView.removeListener('*', this.__handleViewEvent, this);
        }
    }
});

core.Main.addStatics('kanso.ui.Widget', {
    type: 'Widget',
    count: 0
});
