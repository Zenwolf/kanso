/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import Immutable from 'immutable';
import processAction from './processAction2';

export default function dispatchActions(
    stores = Immutable.Map(),
    state = null,
    actions = []
) {
    for (let i = 0, l = actions.length; i < l; i++) {
        state = processAction(stores, state, actions[i]);
    }

    return state;
}