import AppDataRecord from '../src/AppDataRecord';
import assert from 'assert';
import Immutable from 'immutable';
import processAction from '../src/util/processAction';

const state = Immutable.Map({ name: 'zork' });
const AppAPI =

const data = new AppDataRecord({
    api:
});

describe('processAction', () => {

    it('should return a new AppDataRecord when an action caused modifications', () => {

    });

});
