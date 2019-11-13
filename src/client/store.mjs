import {createStore, applyMiddleware, compose} from 'redux';
import {LOCALSTORAGE_STATE_KEY} from 'config';
import initActionHandlers from 'actionHandlers';
import reducer from './reducer';

const {__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: composeEnhancers = compose} = window;

const actionHandlers = initActionHandlers();

const store = createStore(reducer, null, composeEnhancers(applyMiddleware(actionHandlers.complementAction)));

export const {dispatch, getState, subscribe} = store;

export const select = selector => selector(getState());

export const subscribeSelector = (selector, callback, skipIfFalsy) => {
    let currentValue = selector(getState());

    if (currentValue || !skipIfFalsy) {
        callback(currentValue);
    }

    return subscribe(() => {
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
};

window.addEventListener('unload', () => {
    console.log('set state to local storage');
    const data = {
        state: getState(),
        timestamp: Date.now(),
    };
    localStorage.setItem(LOCALSTORAGE_STATE_KEY, JSON.stringify(data));
});

export default store;
