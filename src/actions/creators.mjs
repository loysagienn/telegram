import {
    UPDATE,
    INIT_STATE,
    SET_AUTH_PHONE,
    SET_AUTH_CODE,
    LOAD_FILE,
} from './types';


export const update = upd => ({type: UPDATE, update: upd});
export const initState = state => ({type: INIT_STATE, state});
export const setAuthPhone = phoneNumber => ({type: SET_AUTH_PHONE, phoneNumber});
export const setAuthCode = code => ({type: SET_AUTH_CODE, code});
export const loadFile = fileId => ({type: LOAD_FILE, fileId});
