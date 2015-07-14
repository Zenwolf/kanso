import {KEY_NAMES} from './TestConstants';
import QueryAPI from '../../src/QueryAPI';

export default function createTestAppAPI() {
    return QueryAPI({
        queries: {
            getDescription: state => state.getIn([KEY_NAMES, 'description']),
            getName: state => state.getIn([KEY_NAMES, 'name'])
        },
        validateState: state => {}
    });
}
