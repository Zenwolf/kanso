/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import composeFnsWithVals from './composeFnsWithVals';
import reduceState from './reduceState';
import setState from './setState';

/**
 * Creates a new set of data based on an action. Executes the action interceptor
 * chain before operating on state.
 *
 * @param {Immutable.Map} data
 * @param {Object} action
 * @return {Immutable.Map} the new data
 */
export default function processAction(data, action) {
    // Although it is possible to use one long functions-in-functions call here,
    // we use vars to increase the readability.
    const {actionInterceptors, state, stateTransformers} = data;
    const executeInterceptors = composeFnsWithVals(actionInterceptors);
    const interceptedAction = executeInterceptors(action);
    const nextState = reduceState(state, stateTransformers, interceptedAction);
    const nextData = setState(data, nextState);
    return nextData;
}
