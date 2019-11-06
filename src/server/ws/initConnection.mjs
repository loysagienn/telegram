import {promises as fs} from 'fs';
import {initState} from 'actions';
import UserStore from './userStore';
import handleMessage from './handleMessage';


const activeStates = {};
const DB_ROOT = '/home/vajs/telegram/db/';

const initDbDirectory = async (userHash) => {
    const dbDir = `${DB_ROOT}${userHash}`;

    try {
        await fs.stat(dbDir);
    } catch (error) {
        await fs.mkdir(dbDir);
    }

    return dbDir;
};

const getUserStore = async (userHash) => {
    if (userHash in activeStates) {
        return activeStates[userHash];
    }

    const dbDir = await initDbDirectory(userHash);

    return activeStates[userHash] = new UserStore(dbDir);
};


const initConnection = async (connection) => {
    const {userHash} = connection;

    const store = await getUserStore(userHash);

    connection.send(initState(store.reduxStore.getState()));

    store.on('updateAction', action => connection.send(action));

    connection.on('message', message => handleMessage(store, message));
};

export default initConnection;
