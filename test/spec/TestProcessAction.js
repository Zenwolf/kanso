// import assert from 'assert';
// import {changeNameAction} from '../util/TestActionCreators';
// import createTestAppState from '../util/createTestAppState';
// import createTestStateStores from '../util/createTestStateStores';
// import Immutable from 'immutable';
// import {KEY_NAMES} from '../util/TestConstants';
// import processAction from '../../src/util/processAction';

// const stateStores = createTestStateStores();
// const appState = Immutable.Map({
//     [KEY_NAMES]: stateStores.get(KEY_NAMES)()
// });

// describe('processAction', () => {

//     it('should return a new state when an action causes a state change', () => {
//         const newName = 'grue';
//         const result = processAction(stateStores, appState, changeNameAction(newName));
//         assert(Immutable.Map.isMap(result));
//         assert(result !== appState);
//         assert(result.getIn([KEY_NAMES, 'name']) === newName);
//     });

//     it('should return the same state when an action causes no state change', () => {
//         const currentName = appState.getIn([KEY_NAMES, 'name']);
//         const result = processAction(stateStores, appState, changeNameAction(currentName));
//         assert(Immutable.Map.isMap(result));
//         console.log('%j', result);
//         console.log('%j', appState);
//         assert(result === appState);
//         assert(result.getIn([KEY_NAMES, 'name']) === currentName);
//     });

//     it('should return the same state when there is no action', () => {
//         const currentName = appState.getIn([KEY_NAMES, 'name']);
//         const result = processAction(stateStores, appState);
//         assert(Immutable.Map.isMap(result));
//         assert(result === appState);
//         assert(result.getIn([KEY_NAMES, 'name']) === currentName);
//     });

//     it('should throw an error when there is no AppDataRecord', done => {
//         try {
//             processAction();
//             done(new Error('Expected error to be thrown'));
//         }
//         catch (e) {
//             assert(e.name === 'ValidationError');
//             done();
//         }
//     });
// });
