import {
    ACTION_CHANGE_DESC,
    ACTION_CHANGE_NAME,
    KEY_NAMES } from './TestConstants';
import Immutable from 'immutable';
import StateStore from '../../src/StateStore';

const actionHandlers = {
    [ACTION_CHANGE_DESC]: (state, action) => state.set('description', action.newDesc),
    [ACTION_CHANGE_NAME]: (state, action) => state.set('name', action.newName)
};

const initialNameState = Immutable.Map({
    name: 'zork',
    description: 'An interactive text adventure.'
});

export default function createTestStateStores() {
    return Immutable.Map({
        [KEY_NAMES]: StateStore(initialNameState, actionHandlers)
    });
}
