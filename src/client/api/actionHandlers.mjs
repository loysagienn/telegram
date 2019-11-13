import {SET_AUTH_PHONE, SET_AUTH_CODE, LOAD_FILE, REGISTER_USER, CHECK_PASSWORD, LOAD_CHATS} from 'actions';
import {selectLastAction} from 'selectors';

const getLastAction = state => selectLastAction(state);

export default {
    [SET_AUTH_PHONE]: getLastAction,
    [SET_AUTH_CODE]: getLastAction,
    [LOAD_FILE]: getLastAction,
    [REGISTER_USER]: getLastAction,
    [CHECK_PASSWORD]: getLastAction,
    [LOAD_CHATS]: getLastAction,
};
