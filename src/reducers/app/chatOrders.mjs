import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE) {
        if (
            update._ === 'updateChatLastMessage' ||
            update._ === 'updateChatOrder' ||
            update._ === 'updateChatIsPinned' ||
            update._ === 'updateChatDraftMessage'
        ) {
            const {chatId, order} = update;

            // if (state[chatId] === order) {
            //     return state;
            // }

            return Object.assign({}, state, {[chatId]: order});
        }
    }

    return state;
};
