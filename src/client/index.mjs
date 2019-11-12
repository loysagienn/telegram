import {batchActions} from 'actions';
import {dispatch} from 'client/store';
import {socket} from './api';
import {renderApp} from './components';

let actionsQueue = [];
let collectActions = false;
let actionsCount = 0;

setInterval(() => actionsCount = actionsCount < 2 ? 0 : Math.floor(actionsCount / 2), 1000);

const dispatchAction = (action) => {
    actionsCount++;

    if (collectActions) {
        actionsQueue.push(action);

        return;
    }

    // если меньше 10 экшнов в секунду - диспатчим сразу
    if (actionsCount < 10) {
        dispatch(action);

        return;
    }

    collectActions = true;

    setTimeout(() => {
        dispatch(batchActions(actionsQueue));

        actionsQueue = [];

        collectActions = false;
    }, 200);
};

socket.on('message', (message) => {
    if (message.type) {
        dispatchAction(message);
    }
});

renderApp();


const initTgsPlayer = () => {
    const playerUrl = 'https://unpkg.com/@lottiefiles/lottie-player@0.2.1/dist/tgs-player.js';
    const script = document.createElement('script');
    script.async = true;
    script.src = playerUrl;

    document.body.appendChild(script);
};

initTgsPlayer();
