import assert from 'assert';
import CustomError from '../src/CustomError';

function FooError(msg) {
    CustomError.call(this, 'FooError', msg);
}

FooError.prototype = Object.create(CustomError.prototype);

describe('CustomError', () => {

    it('should have the name that was passed into the constructor', () => {
        assert(new CustomError('TestError', 'foo').name === 'TestError');
    });

    it('should have the message that was passed into the constructor', () => {
        assert(new CustomError('TestError', 'foo').message === 'foo');
    });

    it('should have a stack trace', () => {
        assert(typeof new CustomError('TestError', 'foo').stack === 'string');
    });

    it('should be extendable', () => {
        const error = new FooError('zot');

        assert(error.name === 'FooError');
        assert(error.message === 'zot');
        assert(error.stack);
        assert(typeof error.stack === 'string');
        assert(error.stack.indexOf('FooError') > -1);
    });

    it('should have a stack trace', () => {
        const error = new FooError('zot');

        assert(error.stack);
        assert(typeof error.stack === 'string');
        assert(error.stack.indexOf('FooError') > -1);
    });

    it('should be an instance of FooError', () => {
        assert(new FooError('zot') instanceof FooError);
    });

    it('should be an instance of CustomError', () => {
        assert(new FooError('zot') instanceof CustomError);
    });

    it('should be an instance of Error', () => {
        assert(new FooError('zot') instanceof Error);
    });

});
