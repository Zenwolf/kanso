import assert from 'assert';
import queryApi from '../../src/queryApi';
import {ERROR_QUERY_API} from '../../src/constants';

describe('queryApi', () => {
    const testState = {
        name: 'foo',
        things: [
            { id: 'thing1', name: 'Zork' },
            { id: 'thing2', name: 'Grue' }
        ]
    };

    const config = {
        queries: {
            getName(state) {
                return state.name;
            },

            getThingById(state, id) {
                let thing = null;

                state.things.some(obj => {
                    if (obj.id === id) {
                        thing = obj;
                        return true;
                    }
                    return false;
                });

                return thing;
            }
        },

        validateState(s) {
            if (s !== testState) {
                throw new Error('Invalid state');
            }
        }
    };

    let TestApi = null;
    let api = null;

    beforeEach(() => {
        TestApi = queryApi(config);
        api = TestApi(testState);
    });

    it('should throw error if there are no queries', () => {
        try {
            queryApi({ validateState: config.validateState });
            throw new Error('expected error');
        }
        catch (e) {
            assert(e.name === ERROR_QUERY_API);
        }
    });

    it('should throw error if there is no validateState function', () => {
        try {
            queryApi({ queries: config.queries });
            throw new Error('expected error');
        }
        catch (e) {
            assert(e.name === ERROR_QUERY_API);
        }
    });

    it('should create a stateless API function', () => {
        assert(typeof TestApi === 'function');
    });

    it('should create a stateless function that has static queries', () => {
        Object.keys(config.queries).forEach(key => {
            assert(TestApi[key] && config.queries[key]);
        });
    });

    it('should create a stateful API object', () => {
        assert(typeof api === 'object');
    });

    it('should create stateful API query functions', () => {
        Object.keys(config.queries).forEach(key => {
            assert(api[key] && config.queries[key]);
        });
    });

    it('should return a name from the stateless queries', () => {
        assert(TestApi.getName(testState) === testState.name);
    });

    it('should return a name from the stateful queries', () => {
        assert(api.getName() === testState.name);
    });

    it('should return a thing by ID from the stateless queries', () => {
        assert(TestApi.getThingById(testState, 'thing1') === testState.things[0]);
    });

    it('should return a thing by ID from the stateful queries', () => {
        assert(api.getThingById('thing1') === testState.things[0]);
    });

    it('should provide validateState on stateless API', () => {
        assert(typeof TestApi.validateState === 'function');
        assert(TestApi.validateState === config.validateState);
    });

    it('should throw an error if invalid state is passed to static validateState function', () => {
        try {
            TestApi.validateState(null);
            throw new Error('Should have thrown an error');
        }
        catch (e) {
            // expected
        }
    });

    it('should throw an error if invalid state is passed to API creator', () => {
        try {
            TestApi(null);
            throw new Error('Should have thrown an error');
        }
        catch (e) {
            // expected
        }
    });

    it('should throw an error if invalid state is passed to stateless query function', () => {
        try {
            TestApi.getName(null);
            throw new Error('Expected error');
        }
        catch (e) {
            // expected
        }
    });
});
