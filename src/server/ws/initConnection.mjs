
import {initState, useLocalstorageState, setCurrentUser} from 'actions';
import {getUserStore} from './userStore';
import handleMessage from './handleMessage';


const initConnection = async (connection) => {
    const {userHash, lastUpdateIndex, instanceHash} = connection;
    const date = Date.now();
    const {store, fromCache} = await getUserStore(userHash);
    console.log(`getStore time: ${Date.now() - date}ms`);

    const handleUpdateAuthorizationState = (authorizationState) => {
        if (authorizationState === 'authorizationStateReady') {
            store.airgram.api.getChats({
                offsetOrder: '9223372036854775807',
                limit: 10,
            });
            store.airgram.api.getMe().then(({response}) => {
                if (response._ === 'user') {
                    connection.send(setCurrentUser(response));
                } else {
                    console.log('get current user error', response);
                }
            });
        }
    };
    store.on('updateAuthorizationState', handleUpdateAuthorizationState);

    const handleMessageListener = message => handleMessage(store, message, connection);
    connection.on('message', handleMessageListener);

    connection.once('terminate', () => {
        store.off('updateAuthorizationState', handleUpdateAuthorizationState);
        connection.off('message', handleMessageListener);
    });

    const init = (authorizationState) => {
        console.log(`init user ${userHash}`);

        const canFastUpdate = (
            lastUpdateIndex &&
            instanceHash === store.instanceHash &&
            authorizationState === 'authorizationStateReady' &&
            (store.updateActions.length - lastUpdateIndex) < 1000
        );

        console.log('canFastUpdate', canFastUpdate);
        console.log('lastUpdateIndex', lastUpdateIndex);

        if (canFastUpdate) {
            connection.send(initState({
                useSavedState: true,
            }));

            for (let i = lastUpdateIndex + 1; i < store.updateActions.length; i++) {
                connection.send(store.updateActions[i]);
            }
        } else {
            connection.send(initState({
                state: store.reduxStore.getState(),
                instanceHash: store.instanceHash,
                lastUpdateIndex: store.updateActions.length - 1,
            }));
        }

        const updateActionListener = action => connection.send(action);
        store.on('updateAction', updateActionListener);

        connection.once('terminate', () => {
            store.off('updateAction', updateActionListener);
        });

        if (authorizationState === 'authorizationStateReady') {
            store.airgram.api.getMe().then(({response}) => {
                if (response._ === 'user') {
                    connection.send(setCurrentUser(response));
                } else {
                    console.log('get current user error', response);
                }
            });
        }
    };

    if (store.authorizationState) {
        init(store.authorizationState);
        handleUpdateAuthorizationState(store.authorizationState);
    } else {
        store.once('updateAuthorizationState', init);
    }
};

export default initConnection;
