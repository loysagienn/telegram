import {addChatMessages, addUnreadMessages} from 'actions';

const loaders = {};

const getLoader = (store, connection, chatId) => {
    if (loaders[chatId]) {
        loaders[chatId].setData(store, connection);

        return loaders[chatId];
    }

    let currentFromMessageId = 0;
    let count = 0;
    let loading = false;

    const loadWorker = async (fromMessageId = currentFromMessageId, offset = 0) => {
        loading = true;

        const {response} = await store.airgram.api.getChatHistory({
            chatId,
            fromMessageId,
            offset,
            limit: 20,
            onlyLocal: false,
        });

        const {messages} = response;

        if (!messages) {
            console.log('get message error', response);

            return;
        }

        connection.send(addChatMessages(chatId, messages));

        const lastMessageId = messages[messages.length - 1].id;

        if (currentFromMessageId === 0 || fromMessageId < currentFromMessageId) {
            count += messages.length;
        }

        if (count > 10) {
            count = 0;
            loading = false;

            return;
        }

        loadWorker(lastMessageId);
    };

    const load = (fromMessageId, offset) => {
        if (currentFromMessageId !== 0 && fromMessageId >= currentFromMessageId) {
            return;
        }

        currentFromMessageId = fromMessageId;

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
