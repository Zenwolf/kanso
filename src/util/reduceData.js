/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import processAction from './processAction';

function dataReducer(data, action) {
    // console.log('Reducing data with action: %j', action);
    return processAction(data, action);
}

export default function reduceData(initialData, actions) {
    return actions.reduce(dataReducer, initialData);
}
