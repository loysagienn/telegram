import {createSelector} from 'reselect';
import {memoize, memoizeSimple} from 'utils';

export const selectApp = ({app}) => app;

export const selectAuthorizationState = createSelector(selectApp, ({authorizationState}) => authorizationState);

export const selectMainLayout = createSelector(selectAuthorizationState, (authorizationState) => {
    if (
        authorizationState === 'authorizationStateWaitPhoneNumber'
        || authorizationState === 'authorizationStateWaitCode'
    ) {
        return 'login';
    }

    if (authorizationState === 'authorizationStateReady') {
        return 'main';
    }

    return 'loading';
});

export const selectLastAction = ({lastAction}) => lastAction;

export const selectLastActionType = createSelector(selectLastAction, ({type}) => type);

export const selectPhoneNumber = createSelector(selectApp, ({phoneNumber}) => phoneNumber);

export const selectOptions = createSelector(selectApp, ({options}) => options);

export const selectMyId = createSelector(selectOptions, ({my_id}) => my_id || null);

export const selectUsers = createSelector(selectApp, ({users}) => users);

export const selectUser = memoizeSimple(userId => createSelector(selectUsers, users => (users[userId] || null)));


export const selectChats = createSelector(selectApp, ({chats}) => chats);

export const selectChatList = createSelector(selectApp, ({chatList}) => chatList);

export const selectChat = memoizeSimple(chatId => createSelector(selectChats, chats => (chats[chatId] || null)));


export const selectMessages = createSelector(selectApp, ({messages}) => messages);

export const selectChatMessages = memoizeSimple(
    chatId => createSelector(selectMessages, messages => (messages[chatId] || [])),
);
