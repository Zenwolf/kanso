import assert from 'assert';
import composeFns from '../../src/util/composeFns';
import Immutable from 'immutable';

let isDone = false;

const steps = [
    function step1() {},
    function step2() {},
    function step3() { isDone = true; }
];

const steps2 = [
    function step1(o) { o.step1 = true; return o; },
    function step2(o) { o.step2 = true; return o; },
    function step3(o) { o.step3 = true; return o; }
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

    it('should create a function chain from an array that returns final values', () => {
        const fn = composeFns(...steps2);
        const result = fn({});
        assert(result);
        assert(result.step1);
        assert(result.step2);
        assert(result.step3);
    });
});
