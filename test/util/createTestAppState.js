import Immutable from 'immutable';
import {KEY_NAMES} from './TestConstants';

export default function createTestAppState() {
    return Immutable.fromJS({
        [KEY_NAMES]: {
            name: 'zork',
            description: 'An interactive text adventure.'
        }
    });
}
