import Immutable from 'immutable';
import {KEY_NAMES} from './TestConstants';
import createTestStateStores from './createTestStateStores';

export default function createTestAppState() {
    return Immutable.Map({
        [KEY_NAMES]: createTestStateStores().get(KEY_NAMES)()
    });
}
