/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import createIntercept from './util/createIntercept';
import {List} from 'immutable';
import {curry, defaultTo, is, pipe} from 'ramda';

// initData :: Object -> Object
function initData(data) {
    return defaultTo({}, data);
}

// initInterceptors :: string -> List[(a -> a)] -> Object -> Object
function initInterceptors(key, interceptors, data) {
    data[key] = interceptors;
    return data;
}

// initStores :: Map[string, (action -> state -> state)] -> Object -> Object
function initStores(stores, data) {
    data.stateStores = stores;
    return data;
}

// initState :: Object -> Object
function initState(data) {
    data.state = data.stateStores.reduce(
        (_state, store, key) => _state.set(key, store()),
        data.state
    );

    return data;
}

// initActionHistory :: Object -> Object
function initActionHistory(data) {
    data.actionHistory = List();
    return data;
}

// initDispatching :: Object -> Object
function initDispatching(data) {
    data.isDispatching = false;
    data.pendingActions = [];
    return data;
}

// initStateChangeListeners :: Object -> Object
function initStateChangeListeners(data) {
    data.stateChangeListeners = List();
    return data;
}

function initInterceptFn(key, interceptors, data) {
    data[key] = createIntercept(interceptors);
    return data;
}

function initApi(apiFn, data) {
    data.api = is(Function, apiFn) ? apiFn(data.state) : undefined;
    return data;
}

const curriedInitInterceptors = curry(initInterceptors);
const curriedInitActionInterceptors = curriedInitInterceptors('actionInterceptors');
const curriedInitStateInterceptors = curriedInitInterceptors('stateInterceptors');
const curriedInitStores = curry(initStores);
const curriedInitInterceptFn = curry(initInterceptFn);
const curriedInitActionInterceptFn = curriedInitInterceptFn('interceptAction');
const curriedInitStateInterceptFn = curriedInitInterceptFn('interceptState');

// init :: a -> b -> c -> d -> (e -> e)
// init :: List[(a -> a)] -> List[(b -> b)] -> Map[string, (action -> state -> state)] -> (state -> Object) -> (Object -> Object)
function init(actionInterceptors, stateInterceptors, stores, apiFn) {
    return pipe(
        initData,
        curriedInitActionInterceptors(actionInterceptors),
        curriedInitStateInterceptors(stateInterceptors),
        curriedInitStores(stores),
        initState,
        initActionHistory,
        initDispatching,
        curriedInitActionInterceptFn(actionInterceptors),
        curriedInitStateInterceptFn(stateInterceptors),
        initStateChangeListeners
    );
}

export default init;
