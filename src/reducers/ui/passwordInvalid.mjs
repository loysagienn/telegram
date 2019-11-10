import {CHECK_PASSWORD, PASSWORD_INVALID} from 'actions';


export default (state = false, action) => {
    if (action.type === CHECK_PASSWORD) {
        return false;
    }

    if (action.type === PASSWORD_INVALID) {
        return true;
    }

    return state;
};
