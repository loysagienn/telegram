import {createSelector} from 'reselect';
import {memoizeSimple} from 'utils';
import {selectApp} from './common';
import {selectFiles} from './files';


export const selectChats = createSelector(selectApp, ({chats}) => chats);

export const selectChatList = createSelector(selectApp, ({chatList}) => chatList);

export const selectChat = memoizeSimple(chatId => createSelector(selectChats, chats => (chats[chatId] || null)));

export const selectChatType = memoizeSimple(chatId => createSelector(selectChat(chatId), chat => chat.type));

export const selectChatActions = createSelector(selectApp, ({chatActions}) => chatActions);

export const selectChatAction = memoizeSimple(
    chatId => createSelector(selectChatActions, chatActions => (chatActions[chatId] || null)),
);


export const selectLastMessages = createSelector(selectApp, ({lastMessages}) => lastMessages);

export const selectChatLastMessage = memoizeSimple(
    chatId => createSelector(selectLastMessages, lastMessages => (lastMessages[chatId] || null)),
);


export const selectMessages = createSelector(selectApp, ({messages}) => messages);

export const selectChatMessages = memoizeSimple(
    chatId => createSelector(selectMessages, messages => (messages[chatId] || [])),
);

export const selectChatPhotoFile = memoizeSimple(
    chatId => createSelector(selectChat(chatId), selectFiles, (chat, files) => {
        if (!chat.photo) {
            return null;
        }

        const fileId = chat.photo.small.id;

        return files[fileId] || null;
    }),
);
