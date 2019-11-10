import {SET_AUTH_CODE, PHONE_CODE_INVALID} from 'actions';


export default (state = false, action) => {
    if (action.type === SET_AUTH_CODE) {
        return false;
    }

    if (action.type === PHONE_CODE_INVALID) {
        return true;
    }

    return state;
};
