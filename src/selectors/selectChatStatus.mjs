import {createSelector} from 'reselect';
import {memoizeSimple, getWhen} from 'utils';
import {image, video} from 'emoji';
import {selectUsers, selectUserStatuses} from './user';
import {
    selectChat,
    selectChatLastMessage,
    selectChatDraftMessage,
} from './chat';


export const selectUserByChat = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectUsers,
    (chat, users) => {
        if (chat.type._ !== 'chatTypePrivate') {
            return null;
        }

        return users[chat.type.userId] || null;
    },
));

export const selectChatName = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectUsers,
    (chat, users) => {
        if (chat.title) {
            return chat.title;
        }

        if (chat.type._ === 'chatTypePrivate') {
            const user = users[chat.type.userId];

            if (!user) {
                return '';
            }

            const isDeleted = user.type._ === 'userTypeDeleted';

            if (user && user.firstName) {
                let name = user.firstName;

                if (user.lastName) {
                    name += ` ${user.lastName}`;
                }

                if (isDeleted) {
                    name += ' (Deleted)';
                }

                return name;
            }

            if (isDeleted) {
                return 'Deleted Account';
            }
        }

        return '';
    },
));

export const selectUserStatusByChat = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectUserStatuses,
    (chat, statuses) => {
        if (chat.type._ !== 'chatTypePrivate') {
            return null;
        }

        return statuses[chat.type.userId] || null;
    },
));

export const selectChatOnlineStatus = memoizeSimple(chatId => createSelector(
    selectUserStatusByChat(chatId),
    (status) => {
        if (!status) {
            return false;
        }

        return status._ === 'userStatusOnline';
    },
));

export const selectChatLastMessageSender = memoizeSimple(chatId => createSelector(
    selectChatLastMessage(chatId),
    selectUsers,
    (message, users) => {
        if (!message || !message.senderUserId) {
            return null;
        }

        return users[message.senderUserId] || null;
    },
));

const getUserOnlineStatus = (status) => {
    if (!status) {
        return {};
    }

    if (status._ === 'userStatusOnline') {
        return {blue: 'online'};
    }

    if (status._ === 'userStatusOffline') {
        return {gray: `last seen at ${getWhen(status.wasOnline)}`};
    }

    if (status._ === 'userStatusRecently') {
        return {gray: 'last seen recently'};
    }

    if (status._ === 'userStatusLastWeek') {
        return {gray: 'last seen last week'};
    }

    if (status._ === 'userStatusLastMonth') {
        return {gray: 'last seen last month'};
    }

    return {};
};

const getChatMessageStatus = (content) => {
    if (content._ === 'messageText') {
        return content.text.text.substring(0, 50);
    }

    if (content._ === 'messagePhoto') {
        if (content.caption) {
            return `${image} ${content.caption.text.substring(0, 50)}`;
        }

        return image;
    }

    if (content._ === 'messageVideo') {
        if (content.caption) {
            return `${video} ${content.caption.text.substring(0, 50)}`;
        }

        return 'video';
    }

    if (content._ === 'messageDocument') {
        const {caption, document} = content;

        return (caption && caption.text) || (document && document.fileName) || 'document';
    }

    if (content._ === 'messageAnimation') {
        const {caption} = content;

        return (caption && caption.text) || 'animation';
    }

    if (content._ === 'messagePinMessage') {
        return 'pinned message';
    }

    if (content._ === 'messageContactRegistered') {
        return 'joined Telegram';
    }

    if (content._ === 'messageSticker') {
        return 'sticker';
    }

    if (content._ === 'messageChatJoinByLink') {
        return 'joined group via invite link';
    }

    if (content._ === 'messageCall') {
        // console.log(content);
    }

    return content._;
};

export const selectChatStatus = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectChatLastMessage(chatId),
    selectChatLastMessageSender(chatId),
    selectChatDraftMessage(chatId),
    selectUserByChat(chatId),
    selectUserStatusByChat(chatId),
    (chat, lastMessage, lastMessageSender, draftMessage, user, userStatus) => {
        if (chat.type._ === 'chatTypePrivate') {
            if (!user) {
                return {};
            }

            if (lastMessage) {
                const gray = getChatMessageStatus(lastMessage.content);

                return {gray};
            }

            return getUserOnlineStatus(userStatus);
        }

        if (draftMessage) {
            console.log(draftMessage);
            if (draftMessage.inputMessageText) {
                return {
                    red: 'Draft: ',
                    gray: draftMessage.inputMessageText.text.text.substring(0, 50),
                };
            }
        }

        if (lastMessage) {
            let black;

            if (lastMessageSender) {
                if (lastMessageSender.firstName) {
                    if (lastMessage.content._ === 'messageChatJoinByLink') {
                        black = `${lastMessageSender.firstName} `;
                    } else {
                        black = `${lastMessageSender.firstName}: `;
                    }
                }
            }

            const gray = getChatMessageStatus(lastMessage.content);

            return {black, gray};
        }

        return {};
    },
));
