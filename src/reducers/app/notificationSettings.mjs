import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateChatNotificationSettings') {
        const {chatId, notificationSettings} = update;


        return Object.assign({}, state, {[chatId]: notificationSettings});
    }

    if (type === UPDATE && update._ === 'updateNewChat') {
        const {id, notificationSettings} = update.chat;

        return Object.assign({}, state, {[id]: notificationSettings});
    }

    return state;
};
