import assert from 'assert';
import dispatchActions from '../../src/util/dispatchActions';
import Immutable from 'immutable';
import StatelessStore from '../../src/StatelessStore';
import {
    changeDescriptionAction,
    changeNameAction } from '../util/TestActionCreators';

import {
    ACTION_CHANGE_DESC,
    ACTION_CHANGE_NAME,
    KEY_NAMES } from '../util/TestConstants';

const namesState = Immutable.Map({
    description: 'blah',
    name: 'foo'
});

const namesStore = StatelessStore(namesState, {
    [ACTION_CHANGE_DESC]: (state, action) => state.set('description', action.newDesc),
    [ACTION_CHANGE_NAME]: (state, action) => state.set('name', action.newName)
});

const initialState = Immutable.Map({
    [KEY_NAMES]: namesStore()
});

const stores = Immutable.Map({
    [KEY_NAMES]: namesStore
});

describe('dispatchActions', () => {
    it('should return an Immutable.Map of state', () => {
        const state = dispatchActions(
            stores, initialState, changeNameAction('grue'));

        assert(Immutable.Map.isMap(state));
    });

    it('should return an empty Immutable.Map of state when nothing is passed', () => {
        const state = dispatchActions();
        assert(Immutable.Map.isMap(state));
        assert(state.size === 0);
    });

    it('should dispatch a single action', () => {
        const state = dispatchActions(
            stores, initialState, changeNameAction('grue'));

        assert(state !== initialState);
        assert(state.getIn([KEY_NAMES, 'name']) === 'grue');
    });

    it('should dispatch an array of actions', () => {
        const description = 'It is pitch black...';
        const name = 'grue';
        const actions = [
            changeDescriptionAction(description),
            changeNameAction(name)
        ];
        const state = dispatchActions(stores, initialState, actions);

        assert(state !== initialState);
        assert(state.getIn([KEY_NAMES, 'description']) === description);
        assert(state.getIn([KEY_NAMES, 'name']) === name);
    });
});
