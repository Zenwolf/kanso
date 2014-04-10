/**
 *
 */
core.Interface('kanso.ui.WidgetState', {

    construct: function () {
        // states have no properties of their own
    },

    members: {

        enter: function (prevStateName, widget) {},

        exit: function (nextStateName, widget) {},

        getName: function () {},

        initialize: function (widget) {},

        beforeRender: function (widget) {},

        /**
         * Render must be idempotent and pure.
         * @widget {Widget}
         */
        render: function (widget) {},

        afterRender: function (widget) {},

        bindEvents: function (widget) {},

        unbindEvents: function (widget) {},

        destroy: function (widget) {},

        terminate: function (widget) {}
    }
});
