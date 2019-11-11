
import {initState, useLocalstorageState} from 'actions';
import {getUserStore} from './userStore';
import handleMessage from './handleMessage';

let flag = true;


const initConnection = async (connection) => {
    const {userHash} = connection;
    const date = Date.now();
    const {store, fromCache} = await getUserStore(userHash);
    console.log(`getStore time: ${Date.now() - date}ms`);

    if (flag) {
        flag = false;

        // store.airgram.api.logOut();
    }

    const updateActionListener = action => connection.send(action);
    store.on('updateAction', updateActionListener);

    const handleUpdateAuthorizationState = (authorizationState) => {
        if (authorizationState === 'authorizationStateReady') {
            store.airgram.api.getChats({
                offsetOrder: '9223372036854775807',
                limit: 3,
            });
        }
    };
    store.on('updateAuthorizationState', handleUpdateAuthorizationState);

    const handleMessageListener = message => handleMessage(store, message, connection);
    connection.on('message', handleMessageListener);

    connection.once('terminate', () => {
        connection.off('message', handleMessageListener);
        store.off('updateAction', updateActionListener);
        store.off('updateAuthorizationState', handleUpdateAuthorizationState);
    });

    const init = (authorizationState) => {
        console.log(`init user ${userHash}`);
        // если чувак залогинен, инишиал стейт может быть большой, ехать будет долго,
        // но клиент мог сохранить стейт, который был до этого, в локалсторадж,
        // и тут мы ему говорим, что чувак все еще заголинен и можно показывать стейт из локалстораджа
        // эта вся мутотень для того чтобы сэкономить пол секунды на инишиал загрузке
        if (authorizationState === 'authorizationStateReady' && fromCache) {
            connection.send(useLocalstorageState());
        }

        connection.send(initState(store.reduxStore.getState()));
    };

    if (store.authorizationState) {
        init(store.authorizationState);
        handleUpdateAuthorizationState(store.authorizationState);
    } else {
        store.once('updateAuthorizationState', init);
    }
};

export default initConnection;
