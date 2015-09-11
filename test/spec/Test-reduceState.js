import assert from 'assert';
import {changeDescriptionAction, changeNameAction} from '../util/testActionCreators';
import createTestAppState from '../util/createTestAppState';
import createTestStateStores from '../util/createTestStateStores';
import reduceState from '../../src/util/reduceState';
import {KEY_NAMES} from '../util/testConstants';

const name = 'grue';
const description = 'It is pitch black. You are likely to be eaten by a grue.';

const actions = [
    changeNameAction(name),
    changeDescriptionAction(description)
];

const appState = createTestAppState();
const stateStores = createTestStateStores();

describe('reduceState', () => {
    it('should return the same state if nothing changed', () => {
        assert(appState === reduceState(appState, stateStores, { type: 'foo' }));
    });

    it('should return a new state if an action changes a value', () => {
        const result = reduceState(appState, stateStores, actions[0]);
        const nameStuff = result.get(KEY_NAMES);
        assert(appState !== result);
        assert(nameStuff.get('name') === name);
    });
});
