import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateChatOnlineMemberCount') {
        const {chatId, onlineMemberCount} = update;

        return Object.assign({}, state, {[chatId]: onlineMemberCount});
    }

    return state;
};
