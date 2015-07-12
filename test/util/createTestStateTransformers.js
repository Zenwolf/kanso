import {ACTION_CHANGE_NAME, KEY_NAMES} from './TestConstants';
import Immutable from 'immutable';

const actionHandlers = {
    [ACTION_CHANGE_NAME]: (state, action) => state.set('name', action.newName)
};

export default function createTestStateTransformers() {
    return Immutable.Map({
        [KEY_NAMES]: (state, action) => {
            if (!action) {
                return state;
            }

            const handler = actionHandlers[action.type];

            if (!handler) {
                return state;
            }

            return handler(state, action);
        }
    });
}
