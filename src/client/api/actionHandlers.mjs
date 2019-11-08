import {SET_AUTH_PHONE, SET_AUTH_CODE, LOAD_FILE} from 'actions';
import {selectLastAction} from 'selectors';

const getLastAction = state => selectLastAction(state);

export default {
    [SET_AUTH_PHONE]: getLastAction,
    [SET_AUTH_CODE]: getLastAction,
    [LOAD_FILE]: getLastAction,
};
