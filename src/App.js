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

import {DISPATCH_DELAY} from './Constants';

export default class App {
    constructor({
        actionInterceptors = [],
        AppApi = null,
        stateInterceptors = [],
        stateStores = {}
    }) {
        actionInterceptors = Immutable.List(actionInterceptors);
        stateInterceptors = Immutable.List(stateInterceptors);
        stateStores = Immutable.Map(stateStores);

        let state = Immutable.Map();
        let actionHistory = Immutable.List();
        let api = AppApi ? AppApi(state) : null;
        let isDispatching = false;
        let pendingActions = [];
        let stateChangeListeners = Immutable.List();

        const setState = nextState => {
            if (nextState === state) {
                // Nothing changed, so return
                return;
            }

            state = nextState;
            api = AppApi ? AppApi(nextState) : null;

            // Notify state change listeners because of a new state
            // DEV NOTE: since this an Immutable.List, if a listener returns a
            // boolean false, iteration will stop. We will check for this
            // below and issue an error.
            const listenerCount = stateChangeListeners.forEach(
                listener => listener(this));

            if (__DEV__ && listenerCount !== stateChangeListeners.size) {
                throwErr(
                    'AppError',
                    `Not all state change listeners called:
                        A listener may have returned boolean false.
                        Returning false stops listener iteration.
                    `
                );
            }
        };

        /*
         * By using a queue-and-flush pattern, we avoid the problem of actions
         * being dispatched during other actions. With the queue, additional
         * actions are queued as pending until the current dispatch transaction
         * is complete.
         */
        const tryToDispatch = () => {
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
        };

        /*
         * Using defineProperties allows us to create instance methods that are
         * automatically bound to the current instance, have access to the
         * private values if necessary while creating a separate public object
         * API.
         */
        Object.defineProperties(this, {
            /** @return {Immutable.List<Object>} action history */
            actionHistory: {
                enumerable: true,
                get: () => actionHistory
            },

            /** @return {Immutable.List<Function>} */
            actionInterceptors: {
                enumerable: true,
                get: () => actionInterceptors
            },

            /**
             * @param {Function} interceptor function with signature:
             *     action => action
             * @return {Immutable.List<Function>} interceptors
             */
            addActionInterceptor: {
                enumerable: true,
                value: interceptor => actionInterceptors.includes(interceptor) ?
                    actionInterceptors :
                    actionInterceptors = actionInterceptors.push(interceptor)
            },

            /**
             * @param {Function} listener with signature:
             *     app => undefined
             * @return {Immutable.List<Function>} listeners
             */
            addStateChangeListener: {
                enumerable: true,
                value: listener => stateChangeListeners.includes(listener) ?
                    stateChangeListeners :
                    stateChangeListeners = stateChangeListeners.push(listener)
            },

            /**
             * @param {Function} interceptor function with signature:
             *     state => state
             * @return {Immutable.List<Function>} interceptors
             */
            addStateInterceptor: {
                enumerable: true,
                value: interceptor => stateInterceptors.includes(interceptor) ?
                    stateInterceptors :
                    stateInterceptors = stateInterceptors.push(interceptor)
            },

            /** @return {Object} app's stateful state query API */
            api: {
                enumerable: true,
                get: () => api
            },

            /**
             * @return {undefined}
             */
            dispatch: {
                enumerable: true,
                value: action => {
                    pendingActions.push(action);
                    tryToDispatch();
                }
            },

            /**
             * @param {Array<Object>} actions
             * @return {Immutable.Map<string, *>} state
             */
            initializeState: {
                enumerable: true,
                value: actions =>
                    // Skip extra state change logic and update state directly.
                    state = dispatchActions(stateStores, state, actions)
            },

            /**
             * @param {Function} interceptor
             * @return {Immutable.List<Function>} interceptors
             */
            removeActionInterceptor: {
                enumerable: true,
                value: interceptor => {
                    const index = actionInterceptors.indexOf(interceptor);
                    return index > -1 ?
                        actionInterceptors = actionInterceptors.delete(index) :
                        actionInterceptors;
                }
            },

            /**
             * @param {Function} listener
             * @return {Immutable.List<Function>} listeners
             */
            removeStateChangeListener: {
                enumerable: true,
                value: listener => {
                    const index = stateChangeListeners.indexOf(listener);
                    return index > -1 ?
                        stateChangeListeners = stateChangeListeners.delete(index) :
                        stateChangeListeners;
                }
            },

            /**
             * @param {Function} interceptor
             * @return {Immutable.List<Function>} interceptors
             */
            removeStateInterceptor: {
                enumerable: true,
                value: interceptor => {
                    const index = stateInterceptors.indexOf(interceptor);
                    return index > -1 ?
                        stateInterceptors = stateInterceptors.delete(index) :
                        stateInterceptors;
                }
            },

            /** @return {Immutable.Map<string, *>} global state map */
            state: {
                enumerable: true,
                get: () => state
            },

            /**
             * @return {Immutable.List<Function>} interceptors
             */
            stateInterceptors: {
                enumerable: true,
                get: () => stateInterceptors
            },

            /**
             * @return {Immutable.Map<string, Function>} stores
             */
            stateStores: {
                enumerable: true,
                get: () => stateStores
            },

            /** @return {QueryApi} stateless query api. */
            staticApi: {
                enumerable: true,
                get: () => AppApi
            }
        });
    }
}
