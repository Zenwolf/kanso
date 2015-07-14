/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import AppDataRecord from './AppDataRecord';
import {ERROR_APP} from './ErrorConstants';
import Immutable from 'immutable';
import reduceData from './util/reduceData';

export default class App {
    constructor({
        actionInterceptors = [],
        AppAPI = null,
        initialState = {},
        stateInterceptors = [],
        stateTransformers = {}
    } = {}) {
        if (!AppAPI) {
            throwErr('AppAPI is required.');
        }

        let _state = Immutable.Map(initialState);

        let appData = new AppDataRecord({
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

        const visitListener = listener => {
            listener(this);
        };

        const dispatchActions = () => {
            // console.log('#dispatchActions...');

            const initialData = appData;
            const actions = pendingActions;
            pendingActions = [];

            isDispatching = true;
            appData = reduceData(appData, actions);
            // console.log(appData.toJS());

            // If the appData changes, call all change listeners.
            // console.log('Checking if appData changed...');
            if (appData !== initialData) {
                // console.log('appData changed...');
                // console.log('Calling change listeners...');
                changeListeners.forEach(visitListener);
            }

            isDispatching = false;
        };

        const tryToDispatch = () => {
            // console.log('#tryToDispatch...');

            if (isDispatching) {
                setTimeout(tryToDispatch, 16);
                return;
            }

            dispatchActions();
            this.render(this);
        };

        Object.defineProperties(this, {
            /**
             * @type {Immutable.List<Function>}
             */
            actionInterceptors: {
                enumerable: true,
                get: () => appData.actionInterceptors
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
                get: () => appData.api
            },

            changeListeners: {
                enumerable: true,
                get: () => changeListeners
            },

            dispatch: {
                enumerable: true,
                value: action => {
                    // console.log('#dispatch...');
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

            // Override to implement functionality.
            render: {
                enumerable: true,
                value: app => {
                    // Override to implement your own UI layer. For example,
                    // if using React, you could render your top-level
                    // component here and pass in the current api or state.
                    // When the appData changes, the UI can be re-rendered with the
                    // newly updated api or state.
                }
            },

            /**
             * @type {Immutable.Map<string, *>}
             */
            state: {
                enumerable: true,
                get: () => appData.state
            },

            /**
             * @type {Immutable.List<Function>}
             */
            stateTransformers: {
                enumerable: true,
                get: () => appData.stateTransformers
            },

            /**
             * Get the stateless, static API.
             * @return {Function}
             */
            staticAPI: {
                enumerable: true,
                get: () => appData.staticAPI
            }
        });
    }
}

function throwErr(msg) {
    const err = new Error('msg');
    err.name = ERROR_APP;
    throw err;
}
