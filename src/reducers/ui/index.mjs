import {combineReducers} from 'redux';
import authorizationLoading from './authorizationLoading';
import phoneNumberInvalid from './phoneNumberInvalid';
import phoneCodeInvalid from './phoneCodeInvalid';
import passwordInvalid from './passwordInvalid';
import activeChat from './activeChat';


export default combineReducers({
    authorizationLoading,
    phoneNumberInvalid,
    phoneCodeInvalid,
    passwordInvalid,
    activeChat,
});
