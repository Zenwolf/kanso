import AppDataRecord from '../../src/AppDataRecord';
import assert from 'assert';
import {changeNameAction} from '../util/TestActionCreators';
import createTestAppAPI from '../util/createTestAppAPI';
import createTestAppState from '../util/createTestAppState';
import createTestStateTransformers from '../util/createTestStateTransformers';
import Immutable from 'immutable';
import {KEY_NAMES} from '../util/TestConstants';
import processAction from '../../src/util/processAction';

const AppAPI = createTestAppAPI();
const appState = createTestAppState();
const stateTransformers = createTestStateTransformers();
const data = new AppDataRecord({
    api: AppAPI(appState),
    state: appState,
    stateTransformers,
    staticAPI: AppAPI
});

describe('processAction', () => {

    it('should return a new AppDataRecord when an action causes a state change', () => {
        const newName = 'grue';
        const result = processAction(data, changeNameAction(newName));
        assert(result instanceof AppDataRecord);
        assert(result.state !== appState);
        assert(result.state.getIn([KEY_NAMES, 'name']) === newName);
    });

    it('should return the same AppDataRecord when an action causes no state change', () => {
        const currentName = data.state.getIn([KEY_NAMES, 'name']);
        const result = processAction(data, changeNameAction(currentName));
        assert(result instanceof AppDataRecord);
        assert(result.state === appState);
        assert(result.state.getIn([KEY_NAMES, 'name']) === currentName);
    });

    it('should return the same AppDataRecord when there is no action', () => {
        const currentName = data.state.getIn([KEY_NAMES, 'name']);
        const result = processAction(data);
        assert(result instanceof AppDataRecord);
        assert(result.state === appState);
        assert(result.state.getIn([KEY_NAMES, 'name']) === currentName);
    });

    it('should throw an error when there is no AppDataRecord', done => {
        try {
            processAction();
            done(new Error('Expected error to be thrown'));
        }
        catch (e) {
            assert(e.name === 'ValidationError');
            done();
        }
    });
});
