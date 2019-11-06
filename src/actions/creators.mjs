import {
    UPDATE,
    INIT_STATE,
} from './types';


export const update = upd => ({type: UPDATE, update: upd});
export const initState = state => ({type: INIT_STATE, state});
