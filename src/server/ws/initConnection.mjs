import {promises as fs} from 'fs';
import {DATABASE_PATH} from 'config';
import {initState} from 'actions';
import {getUserStore} from './userStore';
import handleMessage from './handleMessage';


const activeStates = {};

const initDbDirectory = async (userHash) => {
    const dbDir = `${DATABASE_PATH}/${userHash}`;

    try {
        await fs.stat(dbDir);
    } catch (error) {
        await fs.mkdir(dbDir);
    }

    return dbDir;
};

const getStore = async (userHash) => {
    if (activeStates[userHash]) {
        return activeStates[userHash];
    }

    const dbDir = await initDbDirectory(userHash);

    return getUserStore(userHash, dbDir);
};


const initConnection = async (connection) => {
    const {userHash} = connection;

    const store = await getStore(userHash);

    connection.send(initState(store.reduxStore.getState()));

    const updateActionListener = action => connection.send(action);
    store.on('updateAction', updateActionListener);

    const handleMessageListener = message => handleMessage(store, message);
    connection.on('message', handleMessageListener);

    connection.once('terminate', () => {
        connection.off('message', handleMessageListener);
        store.off('updateAction', updateActionListener);
    });

    // todo: get chats on login
    store.airgram.api.getChats({
        offsetOrder: '9223372036854775807',
        limit: 3,
    });
};

export default initConnection;
