import {combineReducers} from 'redux';
import authorizationState from './authorizationState';
import connectionState from './connectionState';
import selectedBackground from './selectedBackground';
import options from './options';
import phoneNumber from './phoneNumber';
import users from './users';
import supergroups from './supergroups';
import {chats, chatList} from './chats';
import messages from './messages';
import chatReadStatus from './chatReadStatus';
import supergroupFullInfo from './supergroupFullInfo';

export default combineReducers({
    authorizationState,
    connectionState,
    selectedBackground,
    options,
    phoneNumber,
    users,
    chats,
    chatList,
    supergroups,
    messages,
    chatReadStatus,
    supergroupFullInfo,
});
