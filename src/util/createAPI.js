/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import QueryApi from '../QueryApi';

/**
 * @param {Object} queries
 * @param {Function} validateState
 * @return {Function} the API object factory with the static queries.
 */
export default function createApi(queries, validateState) {
    return QueryApi({queries, validateState});
}
