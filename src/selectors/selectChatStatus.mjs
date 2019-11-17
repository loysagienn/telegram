import {createSelector} from 'reselect';
import {memoizeSimple, getWhen} from 'utils';
import {image, video} from 'emoji';
import {selectUsers, selectUserStatuses} from './user';
import {
    selectChat,
    selectChatAction,
    selectChatLastMessage,
    selectChatDraftMessage,
    selectSupergroups,
    selectChatOnlineMemberCount,
} from './chat';


export const selectUserByChat = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectUsers,
    (chat, users) => {
        if (chat && chat.type._ === 'chatTypePrivate') {
            return users[chat.type.userId] || null;
        }

        return null;
    },
));

export const selectSupergroupByChat = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectSupergroups,
    (chat, supergroups) => {
        if (chat && chat.type.supergroupId) {
            return supergroups[chat.type.supergroupId];
        }

        return null;
    },
));

export const selectChatActionUser = memoizeSimple(chatId => createSelector(
    selectChatAction(chatId),
    selectUsers,
    (action, users) => {
        if (action && action.userId) {
            return users[action.userId];
        }

        return null;
    },
));

export const selectChatName = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectUsers,
    (chat, users) => {
        if (!chat) {
            return '';
        }

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
        if (chat && chat.type._ === 'chatTypePrivate') {
            return statuses[chat.type.userId] || null;
        }

        return null;
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
        const {when, type} = getWhen(status.wasOnline);
        return {gray: `last seen ${type === 'time' ? `at ${when}` : when}`};
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
        return content.text.text.substring(0, 100);
    }

    if (content._ === 'messagePhoto') {
        if (content.caption) {
            return `${image} ${content.caption.text.substring(0, 100)}`;
        }

        return image;
    }

    if (content._ === 'messageVideo') {
        if (content.caption) {
            return `${video} ${content.caption.text.substring(0, 100)}`;
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
        if (content.sticker.emoji) {
            return `${content.sticker.emoji}sticker`;
        }

        return 'sticker';
    }

    if (content._ === 'messageChatJoinByLink') {
        return 'joined group via invite link';
    }

    return content._;
};

export const selectChatHeaderStatus = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectUserByChat(chatId),
    selectUserStatusByChat(chatId),
    selectChatAction(chatId),
    selectChatActionUser(chatId),
    selectSupergroupByChat(chatId),
    selectChatOnlineMemberCount(chatId),
    (chat, user, userStatus, chatAction, actionUser, supergroup, onlineMembersCount) => {
        if (!chat) {
            return {};
        }

        if (chat.type._ === 'chatTypePrivate') {
            if (chatAction) {
                const {action} = chatAction;

                if (action._ === 'chatActionTyping') {
                    return {gray: 'typing...'};
                }
            }

            return getUserOnlineStatus(userStatus);
        }

        if (chatAction) {
            const {action} = chatAction;

            if (action._ === 'chatActionTyping') {
                const actionUserName = actionUser ? `${actionUser.firstName} is ` : '';

                return {
                    gray: `${actionUserName}typing...`,
                };
            }
        }

        if (chat.type._ === 'chatTypeSupergroup') {
            if (chat.type.isChannel) {
                if (supergroup && supergroup.memberCount) {
                    return {gray: `${supergroup.memberCount} subscribers`};
                }

                return {};
            }

            if (supergroup && supergroup.memberCount) {
                if (onlineMembersCount) {
                    return {gray: `${supergroup.memberCount} members, ${onlineMembersCount} online`};
                }

                return {gray: `${supergroup.memberCount} members`};
            }
        }

        console.log(chat.type);

        return {};
    },
));

export const selectChatStatus = memoizeSimple(chatId => createSelector(
    selectChat(chatId),
    selectChatLastMessage(chatId),
    selectChatLastMessageSender(chatId),
    selectChatDraftMessage(chatId),
    selectUserByChat(chatId),
    selectUserStatusByChat(chatId),
    selectChatAction(chatId),
    selectChatActionUser(chatId),
    (chat, lastMessage, lastMessageSender, draftMessage, user, userStatus, chatAction, actionUser) => {
        if (draftMessage) {
            if (draftMessage.inputMessageText) {
                return {
                    red: 'Draft: ',
                    gray: draftMessage.inputMessageText.text.text.substring(0, 100),
                };
            }
        }

        if (chat.type._ === 'chatTypePrivate') {
            if (chatAction) {
                const {action} = chatAction;

                if (action._ === 'chatActionTyping') {
                    return {gray: 'typing...'};
                }
            }

            if (lastMessage) {
                const gray = getChatMessageStatus(lastMessage.content);

                return {gray};
            }

            return getUserOnlineStatus(userStatus);
        }

        if (chatAction) {
            const {action} = chatAction;

            if (action._ === 'chatActionTyping') {
                const actionUserName = actionUser ? `${actionUser.firstName} is ` : '';

                return {
                    gray: `${actionUserName}typing...`,
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
