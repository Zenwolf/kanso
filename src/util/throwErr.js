/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

export default function throwErr(name, msg) {
    const err = new Error(msg);
    err.name = name;
    throw err;
}
