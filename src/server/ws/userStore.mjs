import EventEmitter from 'events';
import {Airgram} from 'airgram';
import {update as updateAction} from 'actions';
import createReduxStore from './createReduxStore';

class UserStore extends EventEmitter {
    constructor(dbDir) {
        super();

        this.reduxStore = createReduxStore();

        this.airgram = new Airgram({
            apiId: 262680,
            apiHash: '177a6b76ea819a88e35525aa0692e850',
            command: '/home/vajs/td/tdlib/lib/libtdjson',
            databaseDirectory: dbDir,
            useFileDatabase: false,
        });

        this.initMiddlewares();
    }

    initMiddlewares() {
        const {dispatch} = this.reduxStore;

        this.airgram.use((ctx, next) => {
            const {update} = ctx;

            if (update) {
                const action = updateAction(update);
                dispatch(action);
                this.emit('updateAction', action);
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


export default UserStore;
