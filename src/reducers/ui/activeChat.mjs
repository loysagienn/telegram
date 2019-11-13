import {SET_ACTIVE_CHAT} from 'actions';


export default (state = false, action) => {
    if (action.type === SET_ACTIVE_CHAT) {
        return action.chatId;
    }

    return state;
};
