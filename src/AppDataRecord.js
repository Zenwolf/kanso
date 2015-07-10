import Immutable from 'immutable';

export default Immutable.Record({

    /** @type {Immutable.List<Function>} */
    actionInterceptors: Immutable.List(),

    /** @type {Object} stateful api from using your CustomAPI() */
    api: null,

    /** @type {Immutable.Map<string, *>} */
    state: Immutable.Map(),

    /** @type {Immutable.List<Function>} */
    stateInterceptors: Immutable.List(),

    /** @type {Immutable.Map<string, Function>} */
    stateTransformers: Immutable.Map(),

    /** @type {Object} stateless api from using QueryAPI() */
    staticAPI: null
});
