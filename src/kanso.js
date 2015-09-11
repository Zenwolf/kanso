/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import dispatchActions from './util/dispatchActions';
import Immutable from 'immutable';
import interceptActions from './util/interceptActions';
import interceptState from './util/interceptState';
import recordActions from './util/recordActions';
import throwErr from './util/throwErr';

import {DISPATCH_DELAY, ERROR_KANSO} from './constants';

export default function kanso({
    actionInterceptors = [],
    apiFn = undefined,
    stateInterceptors = [],
    stateStores = {}
}) {
    actionInterceptors = Immutable.List(actionInterceptors);
    stateInterceptors = Immutable.List(stateInterceptors);
    stateStores = Immutable.Map(stateStores);

    let state = Immutable.Map();
    let actionHistory = Immutable.List();
    let api;
    let isDispatching = false;
    let pendingActions = [];
    let stateChangeListeners = Immutable.List();

    // Set up the initial state by calling all stores and saving their
    // initial states into the global map using their keys.
    state = stateStores.reduce(
        (_state, store, key) => _state.set(key, store()),
        state
    );

    api = apiFn ? apiFn(state) : undefined;

    function addActionInterceptor(interceptor) {
        return actionInterceptors.includes(interceptor) ?
            actionInterceptors :
            actionInterceptors = actionInterceptors.push(interceptor);
    }

    function addStateChangeListener(listener) {
        return stateChangeListeners.includes(listener) ?
            stateChangeListeners :
            stateChangeListeners = stateChangeListeners.push(listener);
    }

    function addStateInterceptor(interceptor) {
        return stateInterceptors.includes(interceptor) ?
            stateInterceptors :
            stateInterceptors = stateInterceptors.push(interceptor);
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
        return index > -1 ?
            actionInterceptors = actionInterceptors.delete(index) :
            actionInterceptors;
    }

    function removeStateChangeListener(listener) {
        const index = stateChangeListeners.indexOf(listener);
        return index > -1 ?
            stateChangeListeners = stateChangeListeners.delete(index) :
            stateChangeListeners;
    }

    function removeStateInterceptor(interceptor) {
        const index = stateInterceptors.indexOf(interceptor);
        return index > -1 ?
            stateInterceptors = stateInterceptors.delete(index) :
            stateInterceptors;
    }

    let kansoObj = {
        /**
         * @return {Immutable.List<Object>} action history
         */
        actionHistory: function() { return actionHistory; },

        /**
         * @return {Immutable.List<Function>}
         */
        actionInterceptors: function() { return actionInterceptors; },

        /**
         * @param {Function} interceptor function with signature:
         *     action => action
         * @return {Immutable.List<Function>} interceptors
         */
        addActionInterceptor,

        /**
         * @param {Function} listener with signature:
         *     obj => undefined
         * @return {Immutable.List<Function>} listeners
         */
        addStateChangeListener,

        /**
         * @param {Function} interceptor function with signature:
         *     state => state
         * @return {Immutable.List<Function>} interceptors
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
         * @return {Immutable.Map<string, *>} state
         */
        initializeState,

        /**
         * @param {Function} interceptor
         * @return {Immutable.List<Function>} interceptors
         */
        removeActionInterceptor,

        /**
         * @param {Function} listener
         * @return {Immutable.List<Function>} listeners
         */
        removeStateChangeListener,

        /**
         * @param {Function} interceptor
         * @return {Immutable.List<Function>} interceptors
         */
        removeStateInterceptor,

        /**
         * @return {Immutable.Map<string, *>}
         */
        state: function() { return state; },

        /**
         * @return {Immutable.List<Function>}
         */
        stateChangeListeners: function() { return stateChangeListeners; },

        /**
         * @return {Immutable.List<Function>}
         */
        stateInterceptors: function() { return stateInterceptors; },

        /**
         * @return {Immutable.Map<string, Function>}
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
        let actions = pendingActions;
        pendingActions = [];
        actions = interceptActions(actionInterceptors, actions);

        let nextState = dispatchActions(stateStores, state, actions);
        nextState = interceptState(stateInterceptors, nextState);
        setState(nextState);

        actionHistory = recordActions(actionHistory, actions);
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
        // DEV NOTE: since this an Immutable.List, if a listener returns a
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
