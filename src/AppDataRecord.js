/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import Immutable from 'immutable';

export default Immutable.Record({

    /**
     * @type {Immutable.List<Function>} List of functions:
     *     action => action
     */
    actionInterceptors: Immutable.List(),

    /** @type {Object} stateful api from using your CustomAPI(state) */
    api: null,

    /** @type {Immutable.Map<string, *>} */
    state: Immutable.Map(),

    /**
     * @type {Immutable.List<Function>} List of functions:
     *     state => state
     */
    stateInterceptors: Immutable.List(),

    /**
     * @type {Immutable.Map<string, Function>} Map of functions:
     *     (state, action) => state
     */
    stateTransformers: Immutable.Map(),

    /** @type {Function} API factory from using QueryAPI() */
    staticAPI: null
});
