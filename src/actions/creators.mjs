import {
    UPDATE,
    INIT_STATE,
    SET_AUTH_PHONE,
    SET_AUTH_CODE,
    LOAD_FILE,
    BATCH_ACTIONS,
    USE_LOCALSTORAGE_STATE,
    PHONE_NUMBER_INVALID,
    PHONE_CODE_INVALID,
} from './types';


export const update = upd => ({type: UPDATE, update: upd});
export const initState = state => ({type: INIT_STATE, state});
export const setAuthPhone = phoneNumber => ({type: SET_AUTH_PHONE, phoneNumber});
export const setAuthCode = code => ({type: SET_AUTH_CODE, code});
export const loadFile = fileId => ({type: LOAD_FILE, fileId});
export const batchActions = actions => ({type: BATCH_ACTIONS, actions});
export const useLocalstorageState = () => ({type: USE_LOCALSTORAGE_STATE});
export const phoneNumberInvalid = () => ({type: PHONE_NUMBER_INVALID});
export const phoneCodeInvalid = () => ({type: PHONE_CODE_INVALID});
