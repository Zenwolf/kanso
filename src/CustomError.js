/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import assign from 'object-assign';

export default function CustomError(
    name = 'CustomError',
    message = 'No message'
) {
    const err = new Error(message);
    err.name = name;

    assign(this, {
        name,
        message,
        stack: err.stack
    });
}

CustomError.prototype = Object.create(Error.prototype);
