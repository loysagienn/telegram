import {
    UPDATE,
    INIT_STATE,
    SET_AUTH_PHONE,
    SET_AUTH_CODE,
    LOAD_FILE,
    BATCH_ACTIONS,
    USE_LOCALSTORAGE_STATE,
    PHONE_NUMBER_INVALID,
    PHONE_CODE_INVALID,
    REGISTER_USER,
    CHECK_PASSWORD,
    PASSWORD_INVALID,
    SET_ACTIVE_CHAT,
    LOAD_CHATS,
    CLIENT_ERROR,
    GET_CHAT_MESSAGES,
    GET_UNREAD_MESSAGES,
    ADD_CHAT_MESSAGES,
    ADD_UNREAD_MESSAGES,
    SET_CURRENT_USER,
    VIEW_MESSAGES,
    UPDATE_FILE,
} from './types';


export const update = upd => ({type: UPDATE, update: upd});
export const initState = params => Object.assign({}, params, {type: INIT_STATE});
export const setAuthPhone = phoneNumber => ({type: SET_AUTH_PHONE, phoneNumber});
export const setAuthCode = code => ({type: SET_AUTH_CODE, code});
export const loadFile = fileId => ({type: LOAD_FILE, fileId});
export const batchActions = actions => ({type: BATCH_ACTIONS, actions});
export const useLocalstorageState = () => ({type: USE_LOCALSTORAGE_STATE});
export const phoneNumberInvalid = () => ({type: PHONE_NUMBER_INVALID});
export const phoneCodeInvalid = () => ({type: PHONE_CODE_INVALID});
export const registerUser = (firstName, lastName) => ({type: REGISTER_USER, firstName, lastName});
export const checkPassword = password => ({type: CHECK_PASSWORD, password});
export const passwordInvalid = () => ({type: PASSWORD_INVALID});
export const setActiveChat = chatId => ({type: SET_ACTIVE_CHAT, chatId});
export const loadChats = lastChatOrder => ({type: LOAD_CHATS, lastChatOrder});
export const clientError = params => Object.assign({}, params, {type: CLIENT_ERROR});
export const getChatMessages = (chatId, fromMessageId, offset = 0) => (
    {type: GET_CHAT_MESSAGES, chatId, fromMessageId, offset}
);
export const getUnreadMessages = (chatId, fromMessageId) => ({type: GET_UNREAD_MESSAGES, chatId, fromMessageId});
export const addChatMessages = (chatId, messages) => ({type: ADD_CHAT_MESSAGES, chatId, messages});
export const addUnreadMessages = (chatId, messages) => ({type: ADD_UNREAD_MESSAGES, chatId, messages});
export const setCurrentUser = user => ({type: SET_CURRENT_USER, user});
export const viewMessages = (chatId, messageIds) => ({type: VIEW_MESSAGES, chatId, messageIds});
export const updateFile = file => ({type: UPDATE_FILE, file});
