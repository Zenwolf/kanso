/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

/**
 * Reduces the initial state by using state stores that map to keys in the state
 * to create a new state based on the action.
 *
 * @param {Immutable.Map} state
 * @param {Immutable.Map<string, Function>} stores
 * @param {Object} action
 * @return {Immutable.Map} the next state
 */
export default function reduceState(state, stores, action) {
    return stores.reduce(
        (_state, store, key) => _state.set(key, store(action, _state.get(key))),
        state
    );
}
