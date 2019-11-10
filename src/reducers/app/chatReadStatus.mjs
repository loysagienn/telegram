import {UPDATE} from 'actions';

const chatReadStatus = (state = {}, {type, update}) => {
    if (type === UPDATE) {
        if (update._ === 'updateNewChat') {
            const {id: chatId, lastReadInboxMessageId, unreadCount, lastReadOutboxMessageId} = update.chat;

            const current = state[chatId] || {};
            const next = Object.assign({}, current, {lastReadInboxMessageId, unreadCount, lastReadOutboxMessageId});

            return Object.assign({}, state, {[chatId]: next});
        }

        if (update._ === 'updateChatReadInbox') {
            const {chatId, lastReadInboxMessageId, unreadCount} = update;

            const current = state[chatId] || {};
            const next = Object.assign({}, current, {lastReadInboxMessageId, unreadCount});

            return Object.assign({}, state, {[chatId]: next});
        }

        if (update._ === 'updateChatReadOutbox') {
            const {chatId, lastReadOutboxMessageId} = update;

            const current = state[chatId] || {};
            const next = Object.assign({}, current, {lastReadOutboxMessageId});

            return Object.assign({}, state, {[chatId]: next});
        }
    }

    return state;
};

export default chatReadStatus;
