import Immutable from 'immutable';

export default function createTestActionInterceptors() {
    return Immutable.List([
        function ai1(action) { return action; },
        function ai2(action) { return action; }
    ]);
}
