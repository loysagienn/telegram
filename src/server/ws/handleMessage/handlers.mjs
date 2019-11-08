const handlers = {
    SET_AUTH_PHONE: (store, message) => {
        const {phoneNumber} = message;

        store.airgram.api.setAuthenticationPhoneNumber({phoneNumber});
    },
    SET_AUTH_CODE: (store, message) => {
        const {code} = message;

        store.airgram.api.checkAuthenticationCode({code});
    },

    LOAD_FILE: (store, message) => {
        const {fileId} = message;

        store.airgram.api.downloadFile({
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
