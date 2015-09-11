/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

/**
 * A factory that creates a stateless store for transforming state data. It
 * returns a function that processes a given state with actions, modifies the
 * state using state transformer functions that you provide, and returns the
 * new state.
 *
 * State can be any value you want.
 *
 * The state transformers require this signature: (state, action) => state
 * The transformers need to understand how to operate on your specific state
 * value.
 *
 * @param {*} initialState -- the initial state value
 * @param {Object<string, Function>} Map of state transformers, where the key is the
 *     action type and the value is a state transformer.
 */
export default function statelessStore(initialState = {}, stateTransformers = {}) {
    return function(actions, state = initialState) {
        if (!actions) {
            return state;
        }

        if (!Array.isArray(actions)) {
            actions = [actions];
        }

        for (let i = 0, l = actions.length; i < l; i++) {
            const action = actions[i];
            let transformer = stateTransformers[action.type];
            state = transformer ? transformer(state, action) : state;
        }

        return state;
    };
}
