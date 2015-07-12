/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import QueryAPI from '../QueryAPI';

/**
 * @param {Object} queries
 * @param {Function} validateState
 * @return {Function} the API object factory with the static queries.
 */
export default function createAPI(queries, validateState) {
    return QueryAPI({queries, validateState});
}
