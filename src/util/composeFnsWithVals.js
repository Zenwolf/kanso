/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

export default function composeFnsWithVals(...fns) {
    return fns.reduceRight((nextFn, fn) => (...vals) => fn(...[nextFn, ...vals]));
}
