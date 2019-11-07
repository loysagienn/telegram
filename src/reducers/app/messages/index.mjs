import {UPDATE} from 'actions';

const updateChatMessage = (state = [], message) => {
    const {length} = state;

    if (length === 0) {
        return [message];
    }

    let index = 0;

    while (state[index].id > message.id && index < length) {
        index++;
    }

    if (state[index].id === message.id) {
        const copy = state.slice();

        copy[index] = message;

        return copy;
    }

    const result = state.slice(0, index);
    result.push(message);

    result.push(...state.slice(index, length));

    return result;
};

const messages = (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateNewMessage') {
        const {message} = update;

        const chat = state[message.chatId] || [];

        return Object.assign({}, state, {[message.chatId]: updateChatMessage(chat, message)});
    }

    return state;
};

export default messages;
