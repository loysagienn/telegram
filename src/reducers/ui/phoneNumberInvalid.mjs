import {SET_AUTH_PHONE, PHONE_NUMBER_INVALID} from 'actions';


export default (state = false, action) => {
    if (action.type === SET_AUTH_PHONE) {
        return false;
    }

    if (action.type === PHONE_NUMBER_INVALID) {
        return true;
    }

    return state;
};
