import assert from 'assert';
import compose from '../../src/util/compose';
import {List} from 'immutable';

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

const stepsList = List(steps);

describe('compose', () => {
    beforeEach(() => isDone = false);
    afterEach(() => isDone = false);

    it('should return a function from an array', () => {
        const result = compose(...steps);
        assert(typeof result === 'function');
    });

    it('should return a function from a List', () => {
        const result = compose(...stepsList);
        assert(typeof result === 'function');
    });

    it('should create a function chain from an array that completes', () => {
        assert(!isDone);
        compose(...steps)();
        assert(isDone);
    });

    it('should create a function chain from a List that completes', () => {
        assert(!isDone);
        compose(...stepsList)();
        assert(isDone);
    });

    it('should create a function chain from an array that returns final values', () => {
        const fn = compose(...steps2);
        const result = fn({});
        assert(result);
        assert(result.step1);
        assert(result.step2);
        assert(result.step3);
    });
});
