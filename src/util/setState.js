/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import composeFns from './composeFns';

/**
 * Sets the state into the data and updates the api if the state is new.
 *
 * @param {AppDataRecord} data
 * @param {Immutable.Map} nextState
 * @return {AppDataRecord} The new data
 */
export default function setState(data, nextState) {
    if (nextState === data.state) {
        return data;
    }

    // Execute the state interceptor chain before updating the data.
    const {stateInterceptors, staticAPI} = data;
    let interceptedState = nextState;

    if (!stateInterceptors.isEmpty()) {
        const executeInterceptors = composeFns(...stateInterceptors);
        interceptedState = executeInterceptors(nextState);
    }

    return data.withMutations(map => {
        map.set('state', interceptedState)
            .set('api', staticAPI(interceptedState));
    });
}
