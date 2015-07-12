import QueryAPI from '../../src/QueryAPI';

export default function createTestAppAPI() {
    return QueryAPI({
        queries: {
            getName: state => state.name
        },
        validateState: state => {}
    });
}
