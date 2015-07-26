/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import reduceState from './reduceState';

/**
 * Creates a new set of data based on an action. Executes the action interceptor
 * chain before operating on state.
 *
 * @param {Immutable.Map<string, Function>} stores -- state stores
 * @param {Immutable.Map} state
 * @param {Object} action
 * @return {Immutable.Map} the next state
 */
export default function processAction(
    stores,
    state,
    action
) {
    return reduceState(state, stores, action);
}
