import {ACTION_CHANGE_DESC, ACTION_CHANGE_NAME} from './TestConstants';

export function changeDescriptionAction(newDesc) {
    return {
        type: ACTION_CHANGE_DESC,
        newDesc
    };
}

export function changeNameAction(newName) {
    return {
        type: ACTION_CHANGE_NAME,
        newName
    };
}

