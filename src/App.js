/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import AppDataRecord from './AppDataRecord';
import Immutable from 'immutable';
import processAction from './util/processAction';

export default class App {
    constructor({
        AppAPI = null,
        actionInterceptors = [],
        initialState = {},
        stateInterceptors = [],
        stateTransformers = {}
    } = {}) {
        let _state = Immutable.Map(initialState);

        let data = new AppDataRecord({
            actionInterceptors: Immutable.List(actionInterceptors),
            api: AppAPI(_state),
            state: _state,
            stateInterceptors: Immutable.List(stateInterceptors),
            stateTransformers: Immutable.Map(stateTransformers),
            staticAPI: AppAPI
        });

        let isFlushing = false;
        // let flushTimerId = null;
        let pendingActions = [];
        let listeners = Immutable.List();

        function flush() {
            const actions = pendingActions;
            isFlushing = true;
            pendingActions = [];
            actions.forEach(action => data = processAction(data, action));
            // flushTimerId = null;
            isFlushing = false;
        }

        function tryToFlush() {
            if (isFlushing) {
                // flushTimerId = setTimeout(tryToFlush, 16);
                setTimeout(tryToFlush, 16);
                return;
            }

            // flushTimerId = null;
            flush();
        }

        Object.defineProperties(this, {
            /**
             * @type {Immutable.List<Function>}
             */
            actionInterceptors: {
                enumerable: true,
                get: () => data.actionInterceptors
            },

            addListener: {
                enumerable: true,
                value: listener => listeners.includes(listener) ?
                    listeners :
                    listeners = listeners.push(listener)
            },

            /**
             * Get the stateful API snapshot that is bound to the current
             * app state.
             * @return {Object}
             */
            api: {
                enumerable: true,
                get: () => data.api
            },

            dispatch: {
                enumerable: true,
                value: action => {
                    pendingActions.push(action);
                    tryToFlush();
                }
            },

            removeListener: {
                enumerable: true,
                value: listener => {
                    const index = listeners.indexOf(listener);
                    return index > -1 ? listeners.delete(index) : listeners;
                }
            },

            /**
             * @type {Immutable.Map<string, *>}
             */
            state: {
                enumerable: true,
                get: () => data.state
            },

            /**
             * @type {Immutable.List<Function>}
             */
            stateTransformers: {
                enumerable: true,
                get: () => data.stateTransformers
            },

            /**
             * Get the stateless, static API.
             * @return {Function}
             */
            staticAPI: {
                enumerable: true,
                get: () => data.staticAPI
            }
        });
    }
}
