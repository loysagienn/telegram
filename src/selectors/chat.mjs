import {createSelector} from 'reselect';
import {memoizeSimple} from 'utils';
import {selectApp} from './common';
import {selectFiles} from './files';


export const selectChats = createSelector(selectApp, ({chats}) => chats);

export const selectChatList = createSelector(selectApp, ({chatList}) => chatList);

export const selectChatOrders = createSelector(selectApp, ({chatOrders}) => chatOrders);

export const selectChatOrder = memoizeSimple(chatId => createSelector(
    selectChatOrders,
    (chatOrders) => {
        const chatOrder = chatOrders[chatId];

        if (chatOrder && chatOrder !== '0') {
            return chatOrder;
        }

        return null;
    },
));

export const selectSortedChatList = createSelector(
    selectChatList,
    selectChatOrders,
    (chatList, orders) => chatList.filter(id => orders[id] && orders[id] !== '0').sort((id1, id2) => {
        if (!orders[id2]) {
            if (!orders[id1]) {
                return 0;
            }

            return -1;
        } else if (!orders[id1]) {
            return 1;
        }

        return orders[id1] > orders[id2] ? -1 : 1;
    }),
);

export const selectChat = memoizeSimple(chatId => createSelector(selectChats, chats => (chats[chatId] || null)));

export const selectChatType = memoizeSimple(chatId => createSelector(selectChat(chatId), chat => chat.type));

export const selectChatActions = createSelector(selectApp, ({chatActions}) => chatActions);

export const selectChatAction = memoizeSimple(
    chatId => createSelector(selectChatActions, chatActions => (chatActions[chatId] || null)),
);

export const selectSupergroups = createSelector(selectApp, ({supergroups}) => supergroups);

export const selectSupergroup = memoizeSimple(supergroupId => createSelector(
    selectSupergroups,
    supergroups => supergroups[supergroupId],
));


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
        if (!chat || !chat.photo) {
            return null;
        }

        const fileId = chat.photo.small.id;

        return files[fileId] || null;
    }),
);

export const selectDraftMessages = createSelector(selectApp, ({draftMessages}) => draftMessages);

export const selectChatDraftMessage = memoizeSimple(
    chatId => createSelector(selectDraftMessages, draftMessages => (draftMessages[chatId] || null)),
);

export const selectReadStatus = createSelector(selectApp, ({chatReadStatus}) => chatReadStatus);

export const selectChatReadStatus = memoizeSimple(
    chatId => createSelector(selectReadStatus, readStatus => (readStatus[chatId] || null)),
);

export const selectNotificationSettings = createSelector(selectApp, ({notificationSettings}) => notificationSettings);

export const selectChatNotificationSettings = memoizeSimple(chatId => createSelector(
    selectNotificationSettings,
    notificationSettings => (notificationSettings[chatId] || null),
));

export const selectOnlineMemberCount = createSelector(selectApp, ({onlineMemberCount}) => onlineMemberCount);

export const selectChatOnlineMemberCount = memoizeSimple(chatId => createSelector(
    selectOnlineMemberCount,
    onlineMemberCount => onlineMemberCount[chatId] || null,
));

export const selectChatIsMute = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectChatNotificationSettings(chatId),
    (chat, notificationSettings) => {
        if (!notificationSettings) {
            return false;
        }

        if (notificationSettings.useDefaultMuteFor) {
            return chat.defaultDisableNotification;
        }

        return true;
    },
));

export const selectChatMeta = memoizeSimple(chatId => createSelector(
    selectChatIsMute(chatId),
    selectChatReadStatus(chatId),
    (isMute, readStatus) => {
        const unreadCount = readStatus ? readStatus.unreadCount : 0;

        return {isMute, unreadCount};
    },
));
