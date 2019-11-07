import {SET_AUTH_PHONE, SET_AUTH_CODE} from 'actions';
import {selectLastAction} from 'selectors';

const getLastAction = state => selectLastAction(state);

export default {
    [SET_AUTH_PHONE]: getLastAction,
    [SET_AUTH_CODE]: getLastAction,
};
