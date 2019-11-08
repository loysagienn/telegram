import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateChatDraftMessage') {
        const {chatId, draftMessage} = update;

        // if (state[chatId] === order) {
        //     return state;
        // }

        return Object.assign({}, state, {[chatId]: draftMessage});
    }

    return state;
};
