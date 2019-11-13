import {phoneNumberInvalid, phoneCodeInvalid, passwordInvalid} from 'actions';


const setAuthPhone = async (store, message, connection) => {
    const {phoneNumber} = message;

    const result = await store.airgram.api.setAuthenticationPhoneNumber({phoneNumber});

    if (result.response._ === 'error' && result.response.message === 'PHONE_NUMBER_INVALID') {
        connection.send(phoneNumberInvalid());
    }

    return result;
};

const registerUser = async (store, message, connection) => {
    const {firstName, lastName} = message;

    return store.airgram.api.registerUser({firstName, lastName});
};

const setAuthCode = async (store, message, connection) => {
    const {code} = message;

    const result = await store.airgram.api.checkAuthenticationCode({code});

    if (result.response._ === 'error' && result.response.message === 'PHONE_CODE_INVALID') {
        connection.send(phoneCodeInvalid());
    }

    if (result.response._ === 'error' && result.response.message === 'PHONE_CODE_EXPIRED') {
        connection.send(phoneCodeInvalid());

        await store.airgram.api.resendAuthenticationCode();
    }

    return result;
};

const checkPassword = async (store, message, connection) => {
    const {password} = message;

    const result = await store.airgram.api.checkAuthenticationPassword({password});

    if (result.response._ === 'error' && result.response.message === 'PASSWORD_HASH_INVALID') {
        connection.send(passwordInvalid());
    }

    return result;
};

const loadChats = async (store, message) => {
    const {lastChatOrder} = message;

    // const maxOffset = BigInt('9223372036854775807');
    // console.log(String(maxOffset - BigInt(chatsCount)));

    return store.airgram.api.getChats({
        offsetOrder: lastChatOrder,
        limit: 10,
    });
};

const handlers = {
    SET_AUTH_PHONE: setAuthPhone,
    SET_AUTH_CODE: setAuthCode,
    REGISTER_USER: registerUser,
    CHECK_PASSWORD: checkPassword,

    LOAD_FILE: (store, message) => {
        const {fileId} = message;

        return store.airgram.api.downloadFile({
            fileId,
            priority: 10,
            limit: 0,
        });
    },

    LOAD_CHATS: loadChats,

    // GET_CHATS: (userDb, message) => {
    //     userDb.airgram.api.getChats({offsetOrder: '9223372036854775807', limit: 1})
    //         .then(console.log, console.log);
    // },
};

export default handlers;
