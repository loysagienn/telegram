import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateUserChatAction') {
        const {chatId, userId, action} = update;

        return Object.assign({}, state, {[chatId]: {userId, action}});
    }

    return state;
};
