/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import Immutable from 'immutable';
import intercept from './intercept';

/**
 * Return the intercepted actions.
 *
 * @param {Immutable.List<Function>} interceptors
 * @param {Array<Object>} actions
 * @return {Array<Object>}
 */
export default function interceptActions(
    interceptors = Immutable.List(),
    actions = []
) {
    for (let i = 0, l = actions.length; i < l; i++) {
        actions[i] = intercept(interceptors, actions[i]);
    }

    return actions;
}
