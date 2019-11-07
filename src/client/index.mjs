import {dispatch} from 'client/store';
import {socket} from './api';
import './components';


socket.on('message', (message) => {
    if (message.type) {
        dispatch(message);
    }
});
