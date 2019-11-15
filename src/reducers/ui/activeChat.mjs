import {SET_ACTIVE_CHAT, INIT_STATE} from 'actions';


export default (state = null, action) => {
    if (action.type === SET_ACTIVE_CHAT) {
        return action.chatId;
    }

    if (action.type === INIT_STATE && !action.useSavedState) {
        return null;
    }

    return state;
};
