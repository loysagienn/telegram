import {createStore, applyMiddleware, compose} from 'redux';
import {LOCALSTORAGE_STATE_KEY} from 'config';
import {selectChat} from 'selectors';
import initActionHandlers from 'actionHandlers';
import {getStateFromLocalstorage} from 'client/localstorage';
import reducer from './reducer';

// const {__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: composeEnhancers = compose} = window;
const composeEnhancers = compose;

const getInitialState = () => {
    const localstorageState = getStateFromLocalstorage();
    const {app, ui, lastUpdateIndex, instanceHash} = localstorageState;
    const activeChat = (ui.activeChat && selectChat(ui.activeChat)(localstorageState)) ? ui.activeChat : null;

    return {
        savedApp: app,
        lastUpdateIndex,
        instanceHash,
        ui: {
            activeChat,
        },
    };
};

const actionHandlers = initActionHandlers();

const store = createStore(
    reducer,
    getInitialState(),
    composeEnhancers(applyMiddleware(actionHandlers.complementAction)),
);

export const {dispatch, getState, subscribe} = store;

export const select = selector => selector(getState());

export const subscribeSelector = (selector, callback, skipIfFalsy) => {
    let currentValue;

    try {
        currentValue = selector(getState());
    } catch (error) {
        console.log('selector error!!!');
        console.log(error);
    }

    let isUnsubscribed = false;

    if (currentValue || !skipIfFalsy) {
        callback(currentValue);
    }

    const unsubscribe = subscribe(() => {
        if (isUnsubscribed) {
            return;
        }

        let value;

        try {
            value = selector(getState());
        } catch (error) {
            console.log('selector error!!!');
            console.log(error);

            return;
        }

        if (value === currentValue) {
            return;
        }

        if (skipIfFalsy && !value) {
            return;
        }

        currentValue = value;

        callback(value);
    });

    return () => {
        isUnsubscribed = true;

        unsubscribe();
    };
};

window.addEventListener('unload', () => {
    console.log('set state to local storage');

    localStorage.setItem(LOCALSTORAGE_STATE_KEY, JSON.stringify(getState()));
});

export default store;
