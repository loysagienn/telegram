import {phoneNumberInvalid, phoneCodeInvalid} from 'actions';


const setAuthPhone = async (store, message, connection) => {
    const {phoneNumber} = message;

    const result = await store.airgram.api.setAuthenticationPhoneNumber({phoneNumber});

    if (result.response._ === 'error' && result.response.message === 'PHONE_NUMBER_INVALID') {
        connection.send(phoneNumberInvalid());
    }

    return result;
};

const setAuthCode = async (store, message, connection) => {
    const {code} = message;

    const result = await store.airgram.api.checkAuthenticationCode({code});

    if (result.response._ === 'error' && result.response.message === 'PHONE_CODE_INVALID') {
        connection.send(phoneCodeInvalid());
    }

    return result;
};

const handlers = {
    SET_AUTH_PHONE: setAuthPhone,
    SET_AUTH_CODE: setAuthCode,

    LOAD_FILE: (store, message) => {
        const {fileId} = message;

        return store.airgram.api.downloadFile({
            fileId,
            priority: 10,
            limit: 0,
        });
    },

    // GET_CHATS: (userDb, message) => {
    //     userDb.airgram.api.getChats({offsetOrder: '9223372036854775807', limit: 1})
    //         .then(console.log, console.log);
    // },
};

export default handlers;
