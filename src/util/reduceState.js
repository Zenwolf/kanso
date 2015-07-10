/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

function stateReducer(action, state, stateTransformer, key) {
    return state.set(key, stateTransformer(state[key], action));
}

/**
 * Reduces the initial state by using state transformers to create a new state
 * based on the action.
 *
 * @param {Immutable.Map} initialState
 * @param {Immutable.Map<string, Function>} transformers
 * @param {Object} action
 * @return {Immutable.Map} the next state
 */
export default function reduceState(initialState, transformers, action) {
    return transformers.reduce(stateReducer.bind(null, action), initialState);
}
