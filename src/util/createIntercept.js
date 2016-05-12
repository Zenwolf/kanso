/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import {compose, identity, ifElse} from 'ramda';

// createIntercept :: List[(x -> x)] -> (x -> x)
const createIntercept = ifElse(
    x => x.isEmpty(),
    x => identity,
    x => compose(...x)
);

export default createIntercept;

// export default function createInterceptFn(x) {
//     return x.isEmpty() ? identity : compose(...x);
// }
