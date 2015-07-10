import assert from 'assert';
import composeFns from '../src/util/composeFns';

let isDone = false;

const steps = [
    function step1(next) { next(); },
    function step2(next) { next(); },
    function step3(next) { next(); },
    function last() { isDone = true; }
];

describe('composeFns', () => {
    beforeEach(() => isDone = false);
    afterEach(() => isDone = false);

    it('should return a function', () => {
        const result = composeFns(...steps);
        assert(typeof result === 'function');
    });

    it('should create a function chain that completes', () => {
        assert(!isDone);
        composeFns(...steps)();
        assert(isDone);
    });
});
