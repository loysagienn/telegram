import {UPDATE, ADD_CHAT_MESSAGES, ADD_UNREAD_MESSAGES} from 'actions';

const updateChatMessage = (state = [], messages) => {
    if (!messages.length) {
        return state;
    }

    const {length} = state;

    if (length === 0) {
        return messages;
    }

    let index = 0;
    const firstMessageId = messages[0].id;

    while (state[index].id > firstMessageId && index < length) {
        index++;
    }

    const result = state.slice(0, index);
    result.push(...messages);

    result.push(...state.slice(index, length));

    return result;
};

const messages = (state = {}, action) => {
    const {type, update} = action;

    if (type === UPDATE && update._ === 'updateNewMessage') {
        const {message} = update;

        const chat = state[message.chatId] || [];

        return Object.assign({}, state, {[message.chatId]: [message].concat(chat)});
    }

    if (type === UPDATE && update._ === 'updateDeleteMessages') {
        const {messageIds, chatId} = update;

        const chat = state[chatId] || [];

        const updated = chat.filter(message => messageIds.indexOf(message.id) === -1);

        return Object.assign({}, state, {[chatId]: updated});
    }

    if (type === ADD_CHAT_MESSAGES) {
        const {messages: list, chatId} = action;

        const chat = state[chatId] || [];

        return Object.assign({}, state, {[chatId]: chat.concat(list)});
    }

    if (type === ADD_UNREAD_MESSAGES) {
        const {messages: list, chatId} = action;

        const chat = state[chatId] || [];

        return Object.assign({}, state, {[chatId]: updateChatMessage(chat, list)});
    }

    return state;
};

export default messages;
