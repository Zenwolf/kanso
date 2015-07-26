/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import composeFns from './composeFns';
import Immutable from 'immutable';

/**
 * Run an interceptor chain with a value.
 *
 * @param {Immutable.List<Function>} interceptors -- a list of functions with
 *     the signature: value => value
 * @param {*} value
 * @return {*} value
 */
export default function intercept(
    interceptors = Immutable.List(),
    value = null
) {
    if (interceptors.isEmpty()) {
        return value;
    }

    return composeFns(...interceptors)(value);
}
