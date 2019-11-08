import EventEmitter from 'events';
import {Airgram} from 'airgram';
import {TDLIBJSON_PATH} from 'config';
import {update as updateAction} from 'actions';
import createReduxStore from './createReduxStore';

const activeStates = {};

class UserStore extends EventEmitter {
    constructor(userHash, dbDir) {
        super();

        this.userHash = userHash;
        this.terminated = false;
        this.unusedCounter = 0;

        this.reduxStore = createReduxStore();

        this.airgram = new Airgram({
            apiId: 262680,
            apiHash: '177a6b76ea819a88e35525aa0692e850',
            command: TDLIBJSON_PATH,
            databaseDirectory: dbDir,
            useFileDatabase: false,
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

                if (!isServiceAction) {
                    this.emit('updateAuthorizationState', state);
                }
            }

            return next();
        });
    }
}

export const getUserStore = (userHash, dbDir) => {
    if (activeStates[userHash]) {
        return activeStates[userHash];
    }

    return new UserStore(userHash, dbDir);
};

export default UserStore;
