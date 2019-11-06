import {combineReducers} from 'redux';
import authorizationState from './authorizationState';
import connectionState from './connectionState';
import selectedBackground from './selectedBackground';
import options from './options';
import phoneNumber from './phoneNumber';

export default combineReducers({
    authorizationState,
    connectionState,
    selectedBackground,
    options,
    phoneNumber,
});
