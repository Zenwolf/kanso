/**
 *
 */
core.Class('kanso.ui.DefaultWidgetState', {

    implement: [kanso.ui.WidgetState],

    construct: function () {
        this.__name = 'default';
    },

    members: {

        enter: function (prevStateName, widget) {
            // NOOP
        },

        exit: function (nextStateName, widget) {
            // NOOP
        },

        getName: function () {
            return this.__name;
        },

        initialize: function (widget) {
            widget._props = widget.getDefaultProps();
        },

        beforeRender: function (widget) {
            // NOOP
        },

        render: function (widget) {
            if (widget._currentView !== null) {
                widget._currentView.render();
            }
        },

        afterRender: function (widget) {
            // NOOP
        },

        bindEvents: function (widget) {
            // NOOP
        },

        unbindEvents: function (widget) {
            // NOOP
        },

        destroy: function (widget) {
            if (widget._currentView) {
                widget._currentView.destroy();
            }
        },

        terminate: function (widget) {
            // NOOP
        }
    }
});
