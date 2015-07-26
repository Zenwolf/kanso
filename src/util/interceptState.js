/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import Immutable from 'immutable';
import intercept from './intercept';

/**
 * Return the intercepted state.
 *
 * @param {Immutable.List<Function>} interceptors
 * @param {Immutable.Map<string, *>} state
 * @return {Immutable.Map<string, *>} the intercepted state
 */
export default function interceptState(
    interceptors = Immutable.List(),
    state = Immutable.Map()
) {
    return intercept(interceptors, state);
}
