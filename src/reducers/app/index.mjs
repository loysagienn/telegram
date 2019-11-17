import {combineReducers} from 'redux';
import authorizationState from './authorizationState';
import connectionState from './connectionState';
import selectedBackground from './selectedBackground';
import options from './options';
import phoneNumber from './phoneNumber';
import users from './users';
import supergroups from './supergroups';
import {chats, chatList, lastMessages} from './chats';
import messages from './messages';
import chatReadStatus from './chatReadStatus';
import supergroupFullInfo from './supergroupFullInfo';
import chatActions from './chatActions';
import userStatuses from './userStatuses';
import files from './files';
import chatOrders from './chatOrders';
import draftMessages from './draftMessages';
import usersFullInfo from './usersFullInfo';
import passwordHint from './passwordHint';
import notificationSettings from './notificationSettings';
import onlineMemberCount from './onlineMemberCount';
import currentUserId from './currentUserId';

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
    lastMessages,
    chatReadStatus,
    supergroupFullInfo,
    chatActions,
    userStatuses,
    files,
    chatOrders,
    draftMessages,
    usersFullInfo,
    passwordHint,
    notificationSettings,
    onlineMemberCount,
    currentUserId,
});
