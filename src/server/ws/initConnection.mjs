
import {initState, useLocalstorageState} from 'actions';
import {getUserStore} from './userStore';
import handleMessage from './handleMessage';


const initConnection = async (connection) => {
    const {userHash} = connection;
    const date = Date.now();
    const store = await getUserStore(userHash);
    console.log(`getStore time: ${Date.now() - date}ms`);


    const updateActionListener = action => connection.send(action);
    store.on('updateAction', updateActionListener);

    const handleMessageListener = message => handleMessage(store, message, connection);
    connection.on('message', handleMessageListener);

    connection.once('terminate', () => {
        connection.off('message', handleMessageListener);
        store.off('updateAction', updateActionListener);
    });

    const init = (authorizationState) => {
        console.log(`init user ${userHash}`);
        // если чувак залогинен, инишиал стейт может быть большой, ехать будет долго,
        // но клиент мог сохранить стейт, который был до этого, в локалсторадж,
        // и тут мы ему говорим, что чувак все еще заголинен и можно показывать стейт из локалстораджа
        // эта вся мутотень для того чтобы сэкономить пол секунды на инишиал загрузке
        if (authorizationState === 'authorizationStateReady') {
            connection.send(useLocalstorageState());
        }

        connection.send(initState(store.reduxStore.getState()));
    };

    if (store.authorizationState) {
        init(store.authorizationState);
    } else {
        store.once('updateAuthorizationState', init);
    }

    // todo: get chats on login
    store.airgram.api.getChats({
        offsetOrder: '9223372036854775807',
        limit: 3,
    });
};

export default initConnection;
