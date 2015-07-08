/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import CustomError from './CustomError';

/**
 * Creates an API object that queries a specific state for data.
 * See: {@link ../docs/QueryAPI.md}
 *
 * @param {Object} options.queries -- contains all the functions that query data
 *     from the provided state. The state must always be the first function
 *     argument.
 *
 * @param {Function} options.validateState -- a function that performs
 *     validation on the provided state.
 *
 * @return {Object} API object with the queries
 */
export default function QueryAPI({
    queries = null,
    validateState = null
} = {}) {
    validateQueries(queries);
    validateStateFn(validateState);

    const keys = Object.keys(queries);

    let fn = state => {
        validateState(state);
        return keys.reduce((api, key) => {
            api[key] = function(...args) {
                return queries[key](...[state, ...args]);
            };

            return api;
        }, {});
    };

    fn.validateState = validateState;

    return keys.reduce((apiFn, key) => {
        apiFn[key] = function(state, ...args) {
            validateState(state);
            return queries[key](...[state, ...args]);
        };

        return apiFn;
    }, fn);
}

export function QueryAPIError(message) {
    CustomError.call(this, 'QueryAPIError', message);
}

QueryAPIError.prototype = CustomError.prototype;

function validateQueries(queries) {
    if (!queries || (typeof queries !== 'object') || Array.isArray(queries)) {
        throwErr('Invalid queries object.');
    }
}

function validateStateFn(fn) {
    if (typeof fn !== 'function') {
        throwErr('validateState must be a function.');
    }
}

function throwErr(msg) {
    throw new QueryAPIError(msg);
}
