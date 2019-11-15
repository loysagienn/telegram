import {
    SET_AUTH_PHONE,
    SET_AUTH_CODE,
    LOAD_FILE,
    REGISTER_USER,
    CHECK_PASSWORD,
    LOAD_CHATS,
    CLIENT_ERROR,
    INIT_STATE,
    SET_ACTIVE_CHAT,
    setActiveChat,
} from 'actions';
import {selectLastAction, selectActiveChatId} from 'selectors';


const getLastAction = state => selectLastAction(state);

export default {
    [SET_AUTH_PHONE]: getLastAction,
    [SET_AUTH_CODE]: getLastAction,
    [LOAD_FILE]: getLastAction,
    [REGISTER_USER]: getLastAction,
    [CHECK_PASSWORD]: getLastAction,
    [LOAD_CHATS]: getLastAction,
    [CLIENT_ERROR]: getLastAction,
    [SET_ACTIVE_CHAT]: getLastAction,
    [INIT_STATE]: (state) => {
        const chatId = selectActiveChatId(state);

        if (chatId) {
            return setActiveChat(chatId);
        }

        return null;
    },
};
