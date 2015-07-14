import App from '../../src/App';
import assert from 'assert';
import {changeNameAction} from '../util/TestActionCreators';
import createTestActionInterceptors from '../util/createTestActionInterceptors';
import createTestAppAPI from '../util/createTestAppAPI';
import createTestAppState from '../util/createTestAppState';
import createTestStateTransformers from '../util/createTestStateTransformers';
import {ERROR_APP} from '../../src/ErrorConstants';
import Immutable from 'immutable';
import TestConstants from '../util/TestConstants';

const actionInterceptors = createTestActionInterceptors();
const AppAPI = createTestAppAPI();
const appState = createTestAppState();
const appAPI = AppAPI(appState);
const stateTransformers = createTestStateTransformers();

let renderCalled = false;
let testApp = null;

class TestApp extends App {
    render() {
        renderCalled = true;
    }
}

describe('App', () => {
    beforeEach(() => {
        testApp = new TestApp({
            actionInterceptors,
            AppAPI,
            initialState: appState,
            stateTransformers
        });
        renderCalled = false;
    });


    describe('constructor', () => {
        it('should throw an error if no AppAPI is provided', () => {
            try {
                new App({
                    initialState: appState,
                    stateTransformers
                });
                throw new Error(`Expected ${ERROR_APP} to be thrown.`);
            }
            catch (e) {
                assert(e.name === ERROR_APP);
            }
        });
    });


    describe('#actionInterceptors', () => {
        it('should return an empty Immutable.List by default', () => {
            const app = new App({
                AppAPI,
                initialState: appState,
                stateTransformers
            });

            assert(Immutable.List.isList(app.actionInterceptors));
            assert(app.actionInterceptors.isEmpty());
        });

        it('should return an Immutable.List that was passed into constructor', () => {
            assert(Immutable.List.isList(testApp.actionInterceptors));
            assert(testApp.actionInterceptors === actionInterceptors);
        });

        it('should return an Immutable.List from an array that was passed into constructor', () => {
            const interceptors = actionInterceptors.toJS();
            const app = new App({
                actionInterceptors: interceptors,
                AppAPI,
                initialState: appState,
                stateTransformers
            });

            assert(Immutable.List.isList(app.actionInterceptors));
            assert(Immutable.is(
                testApp.actionInterceptors,
                Immutable.List(interceptors)
            ));
        });
    });


    describe('#addChangeListener', () => {
        it('should return the current listeners as an Immutable.List', () => {
            const listeners = testApp.addChangeListener(() => {});
            assert(Immutable.List.isList(listeners));
            assert(listeners.size === 1);
            assert(testApp.changeListeners === listeners);
        });

        it('should add a listener function', () => {
            function testFn() {}
            const listeners = testApp.addChangeListener(testFn);
            assert(listeners.first() === testFn);
            assert(testApp.changeListeners.first() === testFn);
        });
    });


    describe('#api', () => {
        it('should return the current api instance', () => {
            const api = testApp.api;
            assert(JSON.stringify(api) === JSON.stringify(appAPI));
        });
    })


    describe('#dispatch', () => {
        it('should call a listener with itself as the arg after a change', done => {
            const newName = 'grue';

            function check(app) {
                assert(testApp === app);
                assert(app.api.getName() === newName);
                app.removeChangeListener(check);
                return done();
            }

            assert(testApp.api.getName() !== newName);
            testApp.addChangeListener(check);
            testApp.dispatch(changeNameAction(newName));
        });
    });
});
