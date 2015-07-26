/**
 * Copyright 2012-2015, Matthew Jaquish <mattjaq@yahoo.com>
 * Apache 2.0 License
 */

import App from './App';
import createApi from './util/createApi';

/**
 * Convenience factory that generates a kanso app.
 *
 * @param  {Array<Function>} options.actionInterceptors
 * @param  {Object} options.apiDef -- { queries, validateState }
 * @param  {Array<Function>}  options.stateInterceptors
 * @param  {Object<string, Function>} options.stateStores
 * @return {App}
 */
export default function kanso({
    actionInterceptors = [],
    apiDef = null,
    stateInterceptors = [],
    stateStores = {}
} = {}) {
    const app = new App({
        actionInterceptors,
        AppApi: apiDef ? createApi(apiDef) : null,
        stateInterceptors,
        stateStores
    });

    return app;
}
