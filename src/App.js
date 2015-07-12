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

        let isDispatching = false;
        let pendingActions = [];
        let changeListeners = Immutable.List();

        function visitAction(action) {
            data = processAction(data, action);
        }

        function visitListener(listener) {
            listener();
        }

        function dispatchActions() {
            const initialData = data;
            const actions = pendingActions;
            pendingActions = [];

            isDispatching = true;
            actions.forEach(visitAction);

            // If the data changes, call all change listeners.
            if (data !== initialData) {
                changeListeners.forEach(visitListener);
            }

            isDispatching = false;
        }

        function tryToDispatch() {
            if (isDispatching) {
                setTimeout(tryToDispatch, 16);
                return;
            }

            dispatchActions();
        }

        Object.defineProperties(this, {
            /**
             * @type {Immutable.List<Function>}
             */
            actionInterceptors: {
                enumerable: true,
                get: () => data.actionInterceptors
            },

            addChangeListener: {
                enumerable: true,
                value: listener => changeListeners.includes(listener) ?
                    changeListeners :
                    changeListeners = changeListeners.push(listener)
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
                    tryToDispatch();
                }
            },

            removeChangeListener: {
                enumerable: true,
                value: listener => {
                    const index = changeListeners.indexOf(listener);
                    return index > -1 ? changeListeners.delete(index) : changeListeners;
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
