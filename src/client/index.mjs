import {batchActions, setActiveChat, SET_ACTIVE_CHAT} from 'actions';
import {dispatch, subscribeSelector} from 'client/store';
import {selectLastAction} from 'selectors';
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

const rootState = {root: true};
let currentHistoryState = window.history.state;

if (!currentHistoryState) {
    currentHistoryState = rootState;
    window.history.replaceState(currentHistoryState, '', '/');
} else {
    if (currentHistoryState.root) {
        dispatch(setActiveChat(null));
    }

    if (currentHistoryState.type === SET_ACTIVE_CHAT) {
        dispatch(currentHistoryState);
    }
}

subscribeSelector(selectLastAction, (action) => {
    if (action !== currentHistoryState && action.type === SET_ACTIVE_CHAT && action.chatId) {
        if (currentHistoryState.type === SET_ACTIVE_CHAT) {
            window.history.replaceState(action, '', '/');
        } else {
            window.history.pushState(action, '', '/');
        }

        currentHistoryState = action;
    }
});

window.addEventListener('popstate', ({state}) => {
    if (state) {
        if (state.root) {
            currentHistoryState = rootState;

            dispatch(setActiveChat(null));
        }

        if (state.type === SET_ACTIVE_CHAT) {
            currentHistoryState = setActiveChat(state.chatId);

            dispatch(currentHistoryState);
        }
    }
});
