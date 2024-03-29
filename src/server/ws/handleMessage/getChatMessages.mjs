import {addChatMessages, addUnreadMessages} from 'actions';

const loaders = {};

const getLoader = (store, connection, chatId) => {
    if (store.loaders[chatId]) {
        store.loaders[chatId].setData(store, connection);

        return store.loaders[chatId];
    }

    store.currentFromChatId[chatId] = 0;
    let count = 0;
    let loading = false;

    const loadWorker = async (fromMessageId = store.currentFromChatId[chatId]) => {
        loading = true;

        const {response} = await store.airgram.api.getChatHistory({
            chatId,
            fromMessageId,
            offset: fromMessageId === 0 ? -1 : 0,
            limit: 20,
            onlyLocal: false,
        });

        const {messages} = response;

        if (!messages) {
            console.log('get message error', response);

            return;
        }

        console.log('get messages', messages.length);

        if (messages.length === 0) {
            loading = false;
            store.currentFromChatId[chatId] = 0;

            return;
        }

        connection.send(addChatMessages(chatId, messages));

        const lastMessageId = messages[messages.length - 1].id;

        if (store.currentFromChatId[chatId] === 0 || fromMessageId < store.currentFromChatId[chatId]) {
            count += messages.length;
        }

        if (count > 10) {
            loading = false;
            store.currentFromChatId[chatId] = 0;

            return;
        }

        loadWorker(lastMessageId);
    };

    const load = (fromMessageId, offset) => {
        if (store.currentFromChatId[chatId] !== 0 && fromMessageId >= store.currentFromChatId[chatId]) {
            return;
        }

        store.currentFromChatId[chatId] = fromMessageId;
        count = 0;

        if (!loading) {
            loadWorker(fromMessageId, offset);
        }
    };

    const setData = (newStore, newConnection) => {
        store = newStore;
        connection = newConnection;
    };

    return loaders[chatId] = {
        load,
        setData,
    };
};

const getChatMessages = async (store, message, connection) => {
    const {chatId, fromMessageId, offset} = message;

    const loader = getLoader(store, connection, chatId);

    loader.load(fromMessageId, offset);

    return 'get messages done';
};

export const getUnreadMessages = async (store, message, connection) => {
    const {chatId, fromMessageId} = message;

    const totalMessages = [];

    while (!totalMessages.length || totalMessages[totalMessages.length - 1].id !== fromMessageId) {
        const limit = 11 - totalMessages.length;
        // eslint-disable-next-line no-await-in-loop
        const {response} = await store.airgram.api.getChatHistory({
            chatId,
            fromMessageId,
            offset: -limit,
            limit,
            onlyLocal: false,
        });

        const {messages} = response;

        if (!messages) {
            console.log('get message error', response);

            return;
        }

        totalMessages.push(...messages);
    }

    connection.send(addUnreadMessages(chatId, totalMessages.slice(0, -1)));
};

export default getChatMessages;
