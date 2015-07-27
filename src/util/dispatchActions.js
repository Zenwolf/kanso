/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import Immutable from 'immutable';
import reduceState from './reduceState';

/**
 * @param {Immutable.Map<string, Function>} stores
 * @param {Immutable.Map<string, *>} state
 * @param {Array<Object>} actions
 * @return {Immutable.Map<string, *>} the next state
 */
export default function dispatchActions(
    stores = Immutable.Map(),
    state = Immutable.Map(),
    actions = []
) {
    if (!Array.isArray(actions)) {
        actions = [actions];
    }

    for (let i = 0, l = actions.length; i < l; i++) {
        state = reduceState(state, stores, actions[i]);
    }

    return state;
}
