/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import createIntercept from './util/createIntercept';
import dispatchActions from './util/dispatchActions';
import {List, Map} from 'immutable';
import throwErr from './util/throwErr';

import {DISPATCH_DELAY, ERROR_KANSO} from './constants';

export default function kanso({
    actionInterceptors = [],
    apiFn = undefined,
    stateInterceptors = [],
    stateStores = {}
}) {
    actionInterceptors = List(actionInterceptors);
    stateInterceptors = List(stateInterceptors);
    stateStores = Map(stateStores);

    let interceptAction = createIntercept(actionInterceptors);
    let interceptState = createIntercept(stateInterceptors);
    let state = Map();
    let actionHistory = List();
    let api;
    let isDispatching = false;
    let pendingActions = [];
    let stateChangeListeners = List();

    // Set up the initial state by calling all stores and saving their
    // initial states into the global map using their keys.
    state = stateStores.reduce(
        (_state, store, key) => _state.set(key, store()),
        state
    );

    api = apiFn ? apiFn(state) : undefined;

    // addActionInterceptor :: List[x] -> x -> List[x]
    function addActionInterceptor(interceptor) {
        if (actionInterceptors.includes(interceptor)) {
            return actionInterceptors;
        }

        actionInterceptors = actionInterceptors.push(interceptor);
        interceptAction = createIntercept(actionInterceptors);
        return actionInterceptors;
    }

    function addStateChangeListener(listener) {
        return stateChangeListeners.includes(listener) ?
            stateChangeListeners :
            stateChangeListeners = stateChangeListeners.push(listener);
    }

    function addStateInterceptor(interceptor) {
        if (stateInterceptors.includes(interceptor)) {
            return stateInterceptors;
        }

        stateInterceptors = stateInterceptors.push(interceptor);
        interceptState = createIntercept(stateInterceptors);
        return stateInterceptors;
    }

    function dispatch(action) {
        pendingActions.push(action);
        tryToDispatch();
    }

    function initializeState(actions) {
        // Skip extra state change logic and update state directly.
        state = dispatchActions(stateStores, state, actions);
        api = apiFn ? apiFn(state) : undefined;
        return state;
    }

    function removeActionInterceptor(interceptor) {
        const index = actionInterceptors.indexOf(interceptor);

        if (index > -1) {
            actionInterceptors = actionInterceptors.delete(index);
            interceptAction = createIntercept(actionInterceptors);
        }

        return actionInterceptors;
    }

    function removeStateChangeListener(listener) {
        const index = stateChangeListeners.indexOf(listener);
        return index > -1 ?
            stateChangeListeners = stateChangeListeners.delete(index) :
            stateChangeListeners;
    }

    function removeStateInterceptor(interceptor) {
        const index = stateInterceptors.indexOf(interceptor);

        if (index > -1) {
            stateInterceptors = stateInterceptors.delete(index);
            interceptState = createIntercept(stateInterceptors);
        }

        return stateInterceptors;
    }

    let kansoObj = {
        /**
         * @return {List<Object>} action history
         */
        actionHistory: function() { return actionHistory; },

        /**
         * @return {List<Function>}
         */
        actionInterceptors: function() { return actionInterceptors; },

        /**
         * @param {Function} interceptor function with signature:
         *     action => action
         * @return {List<Function>} interceptors
         */
        addActionInterceptor,

        /**
         * @param {Function} listener with signature:
         *     obj => undefined
         * @return {List<Function>} listeners
         */
        addStateChangeListener,

        /**
         * @param {Function} interceptor function with signature:
         *     state => state
         * @return {List<Function>} interceptors
         */
        addStateInterceptor,

        /**
         * @return {Object} stateful state query API
         */
        api: function() { return api; },

        /**
         * @return {undefined}
         */
        dispatch,

        /**
         * @param {Array<Object>} actions
         * @return {Map<string, *>} state
         */
        initializeState,

        /**
         * @param {Function} interceptor
         * @return {List<Function>} interceptors
         */
        removeActionInterceptor,

        /**
         * @param {Function} listener
         * @return {List<Function>} listeners
         */
        removeStateChangeListener,

        /**
         * @param {Function} interceptor
         * @return {List<Function>} interceptors
         */
        removeStateInterceptor,

        /**
         * @return {Map<string, *>}
         */
        state: function() { return state; },

        /**
         * @return {List<Function>}
         */
        stateChangeListeners: function() { return stateChangeListeners; },

        /**
         * @return {List<Function>}
         */
        stateInterceptors: function() { return stateInterceptors; },

        /**
         * @return {Map<string, Function>}
         */
        stateStores: function() { return stateStores; },

        /**
         * @return {QueryApi}
         */
        staticApi: function() { return apiFn; }
    };

    /*
     * By using a queue-and-flush pattern, we avoid the problem of actions
     * being dispatched during other actions. With the queue, additional
     * actions are queued as pending until the current dispatch transaction
     * is complete.
     */
    function tryToDispatch() {
        if (isDispatching) {
            setTimeout(tryToDispatch, DISPATCH_DELAY);
            return;
        }

        isDispatching = true;
        const actions = pendingActions;
        pendingActions = [];
        setState(
            interceptState(
                dispatchActions(stateStores, state, actions.map(
                    interceptAction))));

        actionHistory = actionHistory.concat(actions);
        isDispatching = false;
    }

    function setState(nextState) {
        if (nextState === state) {
            // Nothing changed, so return
            return;
        }

        state = nextState;
        api = apiFn ? apiFn(nextState) : undefined;

        // Notify state change listeners because of a new state
        // DEV NOTE: since this an List, if a listener returns a
        // boolean false, iteration will stop. We will check for this
        // below and issue an error.
        const listenerCount = stateChangeListeners.forEach(
            listener => listener(kansoObj));

        if (__DEV__ && (listenerCount < stateChangeListeners.size)) {
            throwErr(
                ERROR_KANSO,
                `Not all state change listeners called:
                    A listener may have returned boolean false.
                    Returning false stops listener iteration.
                `
            );
        }
    }

    return Object.freeze(kansoObj);
}
