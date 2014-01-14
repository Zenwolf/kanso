/**
 * #require(kanso.app.AppCtx)
 */
core.Class('kanso.app.App', {
    /**
     * @appCtx {kanso.app.AppCtx}
     */
    construct: function (appCtx) {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Context objects.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /** {=kanso.app.AppCtx} */
        this.__appCtx = appCtx;


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Event buses.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /** {=kokou.Emitter} */
        this.__systemBus = new kokou.Emitter();

        /** {=kokou.Emitter} */
        this.__uiBus = new kokou.Emitter();

        /** {=kokou.Emitter} */
        this.__commandBus = new kokou.Emitter();

        /** {=kokou.Emitter} */
        this.__requestBus = new kokou.Emitter();


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Collections.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /** {=Map} */
        this.__states = core.Main.createDict();

        /** {=Map} */
        this.__modules = core.Main.createDict();

        /** {=Map} */
        this.__cards = core.Main.createDict();


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Misc.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /** {=String} */
        this.__currentStateName = '';

        /** {=String} */
        this.__currentCardName = '';


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Initialization sub routines.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        this.__initStates();
        this.__initCards();
    },

    members: {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Application lifecycle.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        load: function () {
            this.getCurrentState().load();
        },

        start: function () {
            this.getCurrentState().start();
        },

        login: function () {
            this.getCurrentState().login();
        },

        logout: function () {
            this.getCurrentState().logout();
        },

        /**
         * Delegate binding to the current state.
         */
        bindEvents: function () {
            this.getCurrentState().bindEvents();
        },

        /**
         * Delegate unbinding to the current state.
         */
        unbindEvents: function () {
            this.getCurrentState().unbindEvents();
        },

        /**
         * {Boolean}
         */
        render: function (cardName) {
            var currentCard = this.__getCurrentCard();
            var nextCard = this.getCard(cardName);
            var isSame = (currentCard && currentCard.getName() === cardName);

            if ( isSame ) {
                return false;
            }

            this.__currentCardName = cardName;
            nextCard.render();

            return true;
        },


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Application getters/setters.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /**
         * @nextStateName {String}
         */
        setState: function (nextStateName) {
            var currentState = this.getCurrentState();
            var nextState = this.getState(nextStateName);

            if (currentState) {
                currentState.leave(nextStateName);
            }

            nextState.enter(this.__currentStateName);
            this.__currentStateName = nextStateName;
        },

        /**
         * {kokou.Emitter}
         */
        getSystemBus: function () {
            return this.__systemBus;
        },

        /**
         * {kokou.Emitter}
         */
        getUiBus: function () {
            return this.__uiBus;
        },

        /**
         * {kokou.Emitter}
         */
        getCommandBus: function () {
            return this.__commandBus;
        },

        /**
         * {kokou.Emitter}
         */
        getRequestBus: function () {
            return this.__requestBus;
        },

        /**
         * {String}
         */
        getCurrentStateName: function () {
            return this.__currentStateName;
        },

        /**
         * {String}
         */
        getCurrentCardName: function () {
            return this.__currentCardName;
        },

        /**
         * {kanso.app.AppState} Get a state object from its @stateName {String}.
         */
        getState: function (stateName) {
            return this.__states[stateName];
        },

        /**
         * {kanso.ui.Card} Get a card object from its @cardName {String}.
         */
        getCard: function (cardName) {
            return this.__cards[cardName];
        },


        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Private methods.
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        /**
         * {kanso.app.AppState}
         */
        __getCurrentState: function () {
            return this.__states[ this.__currentStateName ];
        },

        /**
         * {kanso.ui.Card}
         */
        __getCurrentCard: function () {
            return this.__cards[ this.__currentCardName ];
        },

        /**
         * @state {kanso.app.AppState}
         */
        __addState: function (state) {
            this.__states[ state.getName() ] = state;
        },

        /**
         * @card {kanso.ui.Card}
         */
        __addCard: function (card) {
            this.__cards[ card.getName() ] = card;
        },

        __initStates: function () {
            var defaultState = new kanso.app.DefaultAppState();
            this.__addState(defaultState);
            this.setState( defaultState.getName() );
        },

        __initCards: function () {
            this.__addCard( new kanso.ui.Card() );
        }
    }
});
