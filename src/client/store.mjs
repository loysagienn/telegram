import {createStore, applyMiddleware, compose} from 'redux';
import {LOCALSTORAGE_STATE_KEY} from 'config';
import initActionHandlers from 'actionHandlers';
import {getStateFromLocalstorage} from 'client/localstorage';
import reducer from './reducer';

const {__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: composeEnhancers = compose} = window;

const getInitialState = () => {
    const {app, lastUpdateIndex, instanceHash} = getStateFromLocalstorage();

    return {
        savedApp: app,
        lastUpdateIndex,
        instanceHash,
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
    let currentValue = selector(getState());
    let isUnsubscribed = false;

    if (currentValue || !skipIfFalsy) {
        callback(currentValue);
    }

    const unsubscribe = subscribe(() => {
        if (isUnsubscribed) {
            return;
        }

        const value = selector(getState());

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
