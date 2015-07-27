import assert from 'assert';
import Immutable from 'immutable';
import StateStore from '../../src/StateStore';

import {
    ACTION_CHANGE_NAME,
    KEY_NAME } from '../util/TestConstants';

const initialState = Immutable.Map({ name: 'foo' });

function createStore() {
    return StateStore(initialState, {
        [ACTION_CHANGE_NAME]: (state, action) => state.set('name', action.name)
    });
}

describe('StateStore', () => {
    let store;

    beforeEach(() => {
        store = createStore();
    });

    it('should return a function', () => {
        assert(typeof store === 'function');
    });

    it('should assign an object as default state if none is provided', () => {
        store = StateStore();
        const defaultState = store();
        const state = store({ type: 'ZOT' });
        assert(typeof defaultState === 'object');
        assert(!Immutable.Map.isMap(defaultState));
        assert(state === defaultState);
    });

    it('store fn should return the same state when no action is provided', () => {
        assert(store() === initialState);
    });

    it("store fn should return the same state when an action is provided that it doesn't understand", () => {
        assert(store({ type: 'ZOT' }) === initialState);
    });

    it("store fn should return a new state when an action is provided that it understands", () => {
        const newName = 'bar';
        const state = store({ type: ACTION_CHANGE_NAME, name: newName });
        assert(state !== initialState);
        assert(state.get('name') === newName);
    });

    it('store fn should return the updated state by default after changes have occurred', () => {
        const newName = 'bar';
        const state = store({ type: ACTION_CHANGE_NAME, name: newName });
        assert(state.get('name') === newName);
        assert(state === store());
    });

    it('store fn should ignore an external state passed in', () => {
        const newName = 'grue';
        const state = store({ type: ACTION_CHANGE_NAME, name: newName });
        store({ type: 'ZOT' }, initialState);
        assert(store() === state);
    });
});
