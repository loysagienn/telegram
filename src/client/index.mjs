import {dispatch} from 'client/store';
import {initWs} from './api';
import './components';


const ws = initWs();

ws.on('message', (message) => {
    if (message.type) {
        dispatch(message);
    }
});
