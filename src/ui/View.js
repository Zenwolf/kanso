/**
 * The View is only responsible for rendering the user interface. The only
 * logic it contains is how to intercept the native events and how to send
 * messages to its Presenter (or other listeners).
 */
core.Class('kanso.ui.View', {

    include: [kokou.Emitter],

    events: {
        /**
         *
         */
        RENDER: 'view:render',

        /**
         *
         */
        DESTROY: 'view:destroy',

        /**
         * Fired when the view is shown.
         */
        SHOW: 'view:show',

        /**
         * Fired when the view is hidden.
         */
        HIDE: 'view:hide'
    },

    /**
     *
     */
     construct: function (parentId, config) {
        kokou.Emitter.call(this);
        this.domElem = null;
        this.__isRendered = false;
     },

     members: {
        /**
         * {String} Get the view's unique ID.
         */
        getId: function () {},

        /**
         * {boolean} Whether or not the view rendered.
         */
        render: function () {
            if (this.__isRendered) {
                return false;
            }

            this.createDom();
            this.bindDomEvents();

            this.__isRendered = true;

            return true;
        },

        destroy: function () {
            var parentNode = null;

            if (!this.__isRendered) {
                return false;
            }

            this.unbindDomEvents();
            parentNode = this.domElem.parentNode;

            if (parentNode) {
                parentNode.removeChild(this.domElem);
            }

            this.__isRendered = false;

            return true;
        },

        createDom: function () {},

        bindDomEvents: function () {},

        unbindDomEvents: function () {},

        show: function () {},

        hide: function () {},

        isRendered: function () {
            return this.__isRendered;
        }
     }
});
