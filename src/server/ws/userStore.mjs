import {promises as fs} from 'fs';
import {DATABASE_PATH, TDLIBJSON_PATH, FILES_PATH} from 'config';
import EventEmitter from 'events';
import {Airgram} from 'airgram';

import {update as updateAction} from 'actions';
import createReduxStore from './createReduxStore';

const activeStates = {};

class UserStore extends EventEmitter {
    constructor(userHash, dbDir) {
        super();

        this.userHash = userHash;
        this.inited = false;
        this.terminated = false;
        this.unusedCounter = 0;
        this.authorizationState = null;

        this.updateActions = [];

        this.reduxStore = createReduxStore();

        this.airgram = new Airgram({
            useTestDc: false,
            apiId: 262680,
            apiHash: '177a6b76ea819a88e35525aa0692e850',
            command: TDLIBJSON_PATH,
            databaseDirectory: dbDir,
            // filesDirectory: filesDir,
            useFileDatabase: true,
            useChatInfoDatabase: true,
            useMessageDatabase: true,
            useSecretChats: false,
        });

        this.initMiddlewares();

        activeStates[userHash] = this;

        console.log(`create user store, user hash: ${userHash}`);

        this.terminateIfUnused();
    }

    terminate() {
        console.log(`terminate user store, user hash: ${this.userHash}`);

        delete activeStates[this.userHash];

        this.terminated = true;

        try {
            this.airgram.provider.destroy();
        } catch (error) {
            console.log('!!!!!!! AIRGRAM DESTROY ERROR !!!!!!!');
            console.log(error);
            console.log('-------------------------------------');
        }
    }

    terminateIfUnused() {
        if (this.listenerCount('updateAction') === 0) {
            this.unusedCounter += 1;
        } else {
            this.unusedCounter = 0;
        }

        if (this.unusedCounter > 10) {
            this.terminate();
        } else {
            setTimeout(() => this.terminateIfUnused(), 60 * 1000);
        }
    }

    initMiddlewares() {
        const {dispatch} = this.reduxStore;

        this.airgram.use((ctx, next) => {
            const {update} = ctx;

            if (update) {
                let isServiceAction = false;

                if (update._ === 'updateAuthorizationState') {
                    const {_: state} = update.authorizationState;

                    isServiceAction = state === 'authorizationStateWaitTdlibParameters' ||
                                      state === 'authorizationStateWaitEncryptionKey';
                }

                if (!isServiceAction) {
                    const action = updateAction(update);

                    action.updateIndex = this.updateActions.length;

                    this.updateActions.push(action);

                    dispatch(action);

                    this.emit('updateAction', action);
                }
            }

            return next();
        });

        this.airgram.use((ctx, next) => {
            const {_: type, update} = ctx;

            if (type === 'updateAuthorizationState') {
                const {_: state} = update.authorizationState;

                const isServiceAction = state === 'authorizationStateWaitTdlibParameters' ||
                                        state === 'authorizationStateWaitEncryptionKey';

                this.authorizationState = state;

                if (!isServiceAction) {
                    this.emit('updateAuthorizationState', state);
                }
            }

            return next();
        });
    }
}

const initDbDirectory = async (userHash) => {
    const dbDir = `${DATABASE_PATH}/${userHash}`;

    try {
        await fs.stat(dbDir);
    } catch (error) {
        await fs.mkdir(dbDir);
    }

    return dbDir;
};

// const initFilesDirectory = async (userHash) => {
//     const filesDir = `${FILES_PATH}/${userHash}`;

//     try {
//         await fs.stat(filesDir);
//     } catch (error) {
//         await fs.mkdir(filesDir);
//     }

//     return filesDir;
// };

export const getUserStore = async (userHash) => {
    if (activeStates[userHash]) {
        return {
            store: activeStates[userHash],
            fromCache: true,
        };
    }

    const date = Date.now();
    const dbDir = await initDbDirectory(userHash);
    console.log(`initDirectories time: ${Date.now() - date}ms`);

    return {
        store: new UserStore(userHash, dbDir),
        fromCache: false,
    };
};

export default UserStore;
