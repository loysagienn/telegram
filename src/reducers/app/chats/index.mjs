import {UPDATE} from 'actions';

export const chats = (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateNewChat') {
        const {chat} = update;

        return Object.assign({}, state, {[chat.id]: chat});
    }

    return state;
};

export const chatList = (state = [], {type, update}) => {
    if (type === UPDATE && update._ === 'updateNewChat') {
        const {id} = update.chat;

        if (state.includes(id)) {
            return state;
        }

        return state.concat(id);
    }

    return state;
};
