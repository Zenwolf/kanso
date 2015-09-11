import {KEY_NAMES} from './TestConstants';
import queryApi from '../../src/queryApi';

export default function createTestAppAPI() {
    return queryApi({
        queries: {
            getDescription: state => state.getIn([KEY_NAMES, 'description']),
            getName: state => state.getIn([KEY_NAMES, 'name'])
        },
        validateState: state => {}
    });
}
