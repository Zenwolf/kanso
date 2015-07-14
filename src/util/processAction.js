/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import AppDataRecord from '../AppDataRecord';
import composeFns from './composeFns';
import {ERROR_VALIDATION} from '../ErrorConstants';
import reduceState from './reduceState';
import setState from './setState';

/**
 * Creates a new set of data based on an action. Executes the action interceptor
 * chain before operating on state.
 *
 * @param {AppDataRecord} data
 * @param {Object} action
 * @return {AppDataRecord} the new data
 */
export default function processAction(data, action) {
    // console.log('Processing action: %j', action);
    validateAppData(data);

    // Although it is possible to use one long functions-in-functions call here,
    // we use vars to increase the readability.
    const {actionInterceptors, state, stateTransformers} = data;
    let interceptedAction = action;

    if (!actionInterceptors.isEmpty()) {
        // console.log('Executing actionInterceptors...');
        const executeInterceptors = composeFns(...actionInterceptors);
        interceptedAction = executeInterceptors(action);
    }

    // console.log('Intercepted action: %j', interceptedAction);
    const nextState = reduceState(state, stateTransformers, interceptedAction);
    const nextData = setState(data, nextState);
    return nextData;
}

function validateAppData(data) {
    if (!(data instanceof AppDataRecord)) {
        throwErr('data of type AppDataRecord is required.');
    }
}

function throwErr(msg) {
    const err = new Error(msg);
    err.name = ERROR_VALIDATION;
    throw err;
}
