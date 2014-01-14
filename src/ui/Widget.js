/**
 * A Widget is a Presenter that encapsulates the UI logic. It receives
 * messages from the View about the user interaction. The Widget decides
 * what to do about the messages, how to update any related data, and when to
 * update and render the view.
 */
core.Class('kanso.ui.Widget', {

    include: [kokou.Emitter],

    /**
     * The widget constructor, which takes the @parentId {String}, a
     * @resource {kanso.data.Resource}, and a @config {Object}.
     *
     * @config.id {String}
     */
    construct: function(parentId, resource, config) {
        kokou.Emitter.call(this);

        this.__views = {};
        this.__widgets = [];
        this.__currentView = null;
    },

    members: {
        /**
         * {String} Get the widget's unique ID.
         */
        getId: function () {
            // TODO
        },

        /**
         * {String} Get the widget's type.
         */
        getType: function () {
            // TODO
        },

        /**
         * {kanso.data.Resource} Get the widget's resource object.
         */
        getResource: function () {
            // TODO
        },

        /**
         * Set the widget's @resource {kanso.data.Resource} object.
         */
        setResource: function (resource) {
            // TODO
        },

        /**
         * {kanso.ui.View} Get a widget view by @id {String}.
         */
        getView: function (viewId) {
            return this.__views[viewId];
        },

        /**
         * Add a @view {kanso.ui.View} on the widget. The view will be stored
         * and referenced by its unique ID.
         */
        addView: function (view) {
            this.__views[ view.getId() ] = view;
        },

        /**
         * {kanso.ui.View}
         */
        removeView: function (viewId) {
            var view = this.__views[viewId];

            delete this.__views[viewId];

            return view;
        },

        selectView: function (viewId) {
            var nextView = this.__views[viewId];
            var currentView = this.__currentView;

            if (currentView !== null) {
                // TODO change this?
                currentView.destroyView();
            }

            this.__currentView = nextView;
        },

        /**
         * {integer} Returns the index of the widget.
         */
        addWidget: function (widget) {
            return this.__widgets.push(widget) - 1;
        },

        /**
         * {Boolean} Tell the widget to render. Returns true if it rendered,
         * otherwise false.
         */
        render: function () {
            this.renderWidgets();
            this.renderView();
        },

        renderWidgets: function () {
            var i = 0;
            var l = 0;
            var widgets = this.__widgets;
            var widget = null;

            // Widgets are a composite, so tell widgets to render.
            for (i = 0, l = widgets.length; i < l; i += 1) {
                widget = widgets[i];
                widget.render();
            }
        },

        renderView: function () {
            if (this.__currentView !== null) {
                this.__currentView.render();
            }
        },

        /**
         * {Boolean} Tell the widget to destroy. Returns true if it destroyed,
         * otherwise false.
         */
        destroy: function () {
            this.destroyWidgets();
            this.destroyView();
        },

        destroyWidgets: function () {
            var i = 0;
            var l = 0;
            var widgets = this.__widgets;
            var widget = null;

            // Widgets are a composite, so tell widgets to destroy.
            for (i = 0, l = widgets.length; i < l; i += 1) {
                widget = widgets[i];
                widget.destroy();
            }
        },

        destroyView: function () {
            if (this.__currentView) {
                this.__currentView.destroy();
            }
        },

        bindEvents: function() {
            var i = 0;
            var l = 0;
            var widgets = this.__widgets;
            var widget = null;

            // Widgets are a composite, so tell widgets to render.
            for (i = 0, l = widgets.length; i < l; i += 1) {
                widget = widgets[i];
                widget.bindEvents();
            }

            this.bindUiEvents();
        },

        bindUiEvents: function () {},

        unbindEvents: function() {
            var i = 0;
            var l = 0;
            var widgets = this.__widgets;
            var widget = null;

            // Widgets are a composite, so tell widgets to unbind.
            for (i = 0, l = widgets.length; i < l; i += 1) {
                widget = widgets[i];
                widget.unbindEvents();
            }

            this.unbindUiEvents();
        },

        unbindUiEvents: function () {}
    }
});
