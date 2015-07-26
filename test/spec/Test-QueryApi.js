import assert from 'assert';
import QueryAPI from '../../src/QueryAPI';

describe('QueryAPI', () => {
    const testState = {
        name: 'foo',
        things: [
            { id: 'thing1', name: 'Zork' },
            { id: 'thing2', name: 'Grue' }
        ]
    };

    const config = {
        validateState: function(s) {
            if (s !== testState) {
                throw new Error('Invalid state');
            }
        },
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
        }
    };

    let TestAPI = null;
    let api = null;

    beforeEach(() => {
        TestAPI = QueryAPI(config);
        api = TestAPI(testState);
    });

    it('should create a stateless API function', () => {
        assert(typeof TestAPI === 'function');
    });

    it('should create a stateless function that has static queries', () => {
        Object.keys(config.queries).forEach(key => {
            assert(TestAPI[key] && config.queries[key]);
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
        assert(TestAPI.getName(testState) === testState.name);
    });

    it('should return a name from the stateful queries', () => {
        assert(api.getName() === testState.name);
    });

    it('should return a thing by ID from the stateless queries', () => {
        assert(TestAPI.getThingById(testState, 'thing1') === testState.things[0]);
    });

    it('should return a thing by ID from the stateful queries', () => {
        assert(api.getThingById('thing1') === testState.things[0]);
    });

    it('should provide validateState on stateless API', () => {
        assert(typeof TestAPI.validateState === 'function');
        assert(TestAPI.validateState === config.validateState);
    });

    it('should throw an error if invalid state is passed to static validateState function', done => {
        try {
            TestAPI.validateState(null);
            done(new Error('Should have thrown an error'));
        }
        catch (e) {
            return done();
        }
    });

    it('should throw an error if invalid state is passed to API creator', done => {
        try {
            TestAPI(null);
            return done(new Error('Should have thrown an error'));
        }
        catch (e) {
            return done();
        }
    });

    it('should throw an error if invalid state is passed to stateless query function', done => {
        try {
            TestAPI.getName(null);
            return done(new Error('Should have thrown an error'));
        }
        catch (e) {
            return done();
        }
    });
});
