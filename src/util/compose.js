/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

export default function compose(...fns) {
    return fns.reduceRight((nextFn, fn) => (...vals) => nextFn(fn(...vals)));
}
