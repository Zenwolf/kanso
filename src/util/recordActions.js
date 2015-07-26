/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import Immutable from 'immutable';

export default function recordActions(history = Immutable.List(), actions = []) {
    return history.concat(actions);
}
