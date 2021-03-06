import kanso from '../../src/kanso';
import assert from 'assert';
import {changeNameAction} from '../util/testActionCreators';
import createTestActionInterceptors from '../util/createTestActionInterceptors';
import createTestAppAPI from '../util/createTestAppAPI';
import createTestAppState from '../util/createTestAppState';
import createTestStateStores from '../util/createTestStateStores';
import Immutable from 'immutable';
import {ERROR_APP, KEY_NAMES } from '../util/testConstants';

const actionInterceptors = createTestActionInterceptors();
const apiFn = createTestAppAPI();
const stateStores = createTestStateStores();

let renderCalled = false;
let testApp = null;

describe('kanso', () => {
    beforeEach(() => {
        testApp = kanso({
            actionInterceptors,
            apiFn,
            stateStores
        });
        renderCalled = false;
    });


    describe('#actionInterceptors', () => {
        it('should return an empty Immutable.List by default', () => {
            const app = new kanso({
                apiFn,
                stateStores
            });

            assert(Immutable.List.isList(app.actionInterceptors()));
            assert(app.actionInterceptors().isEmpty());
        });

        it('should return an Immutable.List that was passed into constructor', () => {
            assert(Immutable.List.isList(testApp.actionInterceptors()));
            assert(testApp.actionInterceptors() === actionInterceptors);
        });

        it('should return an Immutable.List from an array that was passed into constructor', () => {
            const interceptors = actionInterceptors.toJS();
            const app = new kanso({
                actionInterceptors: interceptors,
                apiFn,
                stateStores
            });

            assert(Immutable.List.isList(app.actionInterceptors()));
            assert(Immutable.is(
                testApp.actionInterceptors(),
                Immutable.List(interceptors)
            ));
        });
    });


    describe('#addStateChangeListener', () => {
        it('should return the current listeners as an Immutable.List', () => {
            const listeners = testApp.addStateChangeListener(() => {});
            assert(Immutable.List.isList(listeners));
            assert(listeners.size === 1);
            assert(testApp.stateChangeListeners() === listeners);
        });

        it('should add a listener function', () => {
            function testFn() {}
            const listeners = testApp.addStateChangeListener(testFn);
            assert(listeners.first() === testFn);
            assert(testApp.stateChangeListeners().first() === testFn);
        });
    });


    describe('#api', () => {
        it('should return the current api instance', () => {
            const state = Immutable.Map({
                [KEY_NAMES]: stateStores.get(KEY_NAMES)()
            });
            const expectedApi = apiFn(state);
            const api = testApp.api;
            assert(JSON.stringify(api()) === JSON.stringify(expectedApi));
        });
    });


    describe('#dispatch', () => {
        it('should call a listener with itself as the arg after a change', done => {
            const newName = 'grue';

            function check(app) {
                assert(testApp === app);
                assert(app.api().getName() === newName);
                app.removeStateChangeListener(check);
                return done();
            }

            assert(testApp.api().getName() !== newName);
            testApp.addStateChangeListener(check);
            testApp.dispatch(changeNameAction(newName));
        });
    });
});
