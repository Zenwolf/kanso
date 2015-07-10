/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import composeFnsWithVals from './composeFnsWithVals';

/**
 * Sets the state into the data and updates the api if the state is new.
 *
 * @param {Immutable.Map} data
 * @param {Immutable.Map} nextState
 * @return {Immutable.Map} The new data
 */
export default function setState(data, nextState) {
    if (nextState === data.state) {
        return data;
    }

    // Execute the state interceptor chain before updating the data.
    const executeInterceptors = composeFnsWithVals(data.stateInterceptors);
    const interceptedState = executeInterceptors(nextState);

    return data.withMutations(map => {
        map.set('state', interceptedState)
            .set('api', data.staticAPI(interceptedState));
    });
}
