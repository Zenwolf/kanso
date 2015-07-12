import {ACTION_CHANGE_NAME} from './TestConstants';

export function changeNameAction(newName) {
    return {
        type: ACTION_CHANGE_NAME,
        newName
    };
}
