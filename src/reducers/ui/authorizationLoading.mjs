import {
    SET_AUTH_PHONE,
    SET_AUTH_CODE,
    CHECK_PASSWORD,
    REGISTER_USER,
    PHONE_NUMBER_INVALID,
    PHONE_CODE_INVALID,
    PASSWORD_INVALID,
    UPDATE,
} from 'actions';


export default (state = false, action) => {
    if (action.type === SET_AUTH_PHONE) {
        return true;
    }

    if (action.type === SET_AUTH_CODE) {
        return true;
    }

    if (action.type === REGISTER_USER) {
        return true;
    }

    if (action.type === CHECK_PASSWORD) {
        return true;
    }

    if (action.type === PHONE_NUMBER_INVALID) {
        return false;
    }

    if (action.type === PHONE_CODE_INVALID) {
        return false;
    }

    if (action.type === PASSWORD_INVALID) {
        return false;
    }

    if (action.type === UPDATE && action.update._ === 'updateAuthorizationState') {
        return false;
    }

    return state;
};
