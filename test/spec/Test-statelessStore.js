import assert from 'assert';
import Immutable from 'immutable';
import statelessStore from '../../src/statelessStore';

import {
    ACTION_CHANGE_NAME,
    KEY_NAME } from '../util/TestConstants';

const initialState = Immutable.Map({ name: 'foo' });

function createStore() {
    return statelessStore(initialState, {
        [ACTION_CHANGE_NAME]: (state, action) => state.set('name', action.name)
    });
}

describe('statelessStore', () => {
    let store;

    beforeEach(() => {
        store = createStore();
    });

    it('should return a function', () => {
        assert(typeof store === 'function');
    });

    it('should return the initial state if none is provided', () => {
        assert(store() === initialState);
    });

    it('store fn should return the provided state when there is no action', () => {
        const state = initialState.set('name', 'grue');
        assert(store(null, state) === state);
    });

    it("store fn should return the same state when an action is provided that it doesn't understand", () => {
        const state = initialState.set('name', 'grue');
        assert(store({ type: 'ZOT' }, state) === state);
    });

    it('store fn should return a new state when an action is provided that it understands', () => {
        const newName = 'bar';
        const state = store({ type: ACTION_CHANGE_NAME, name: newName }, initialState);
        assert(state !== initialState);
        assert(state.get('name') === newName);
    });
});
