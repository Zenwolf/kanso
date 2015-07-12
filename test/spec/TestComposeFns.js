import assert from 'assert';
import composeFns from '../../src/util/composeFns';
import Immutable from 'immutable';

let isDone = false;

const steps = [
    function step1(next) { next(); },
    function step2(next) { next(); },
    function step3(next) { next(); },
    function last() { isDone = true; }
];

const stepsList = Immutable.List(steps);

describe('composeFns', () => {
    beforeEach(() => isDone = false);
    afterEach(() => isDone = false);

    it('should return a function from an array', () => {
        const result = composeFns(...steps);
        assert(typeof result === 'function');
    });

    it('should return a function from an Immutable.List', () => {
        const result = composeFns(...stepsList);
        assert(typeof result === 'function');
    });

    it('should create a function chain from an array that completes', () => {
        assert(!isDone);
        composeFns(...steps)();
        assert(isDone);
    });

    it('should create a function chain from an Immutable.List that completes', () => {
        assert(!isDone);
        composeFns(...stepsList)();
        assert(isDone);
    });
});
