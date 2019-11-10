import {combineReducers} from 'redux';
import authorizationLoading from './authorizationLoading';
import phoneNumberInvalid from './phoneNumberInvalid';
import phoneCodeInvalid from './phoneCodeInvalid';
import passwordInvalid from './passwordInvalid';


export default combineReducers({
    authorizationLoading,
    phoneNumberInvalid,
    phoneCodeInvalid,
    passwordInvalid,
});
