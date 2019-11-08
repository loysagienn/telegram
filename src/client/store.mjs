
import {createStore, applyMiddleware, compose} from 'redux';
import initActionHandlers from 'actionHandlers';
import reducer from './reducer';

const {__REDUX_DEVTOOLS_EXTENSION_COMPOSE__: composeEnhancers = compose} = window;

const actionHandlers = initActionHandlers();

const store = createStore(reducer, null, composeEnhancers(applyMiddleware(actionHandlers.complementAction)));

export const {dispatch, getState, subscribe} = store;

export const select = selector => selector(getState());

export const subscribeSelector = (selector, callback) => {
    let currentValue = selector(getState());

    callback(currentValue);

    return subscribe(() => {
        const value = selector(getState());

        if (value === currentValue) {
            return;
        }

        currentValue = value;

        callback(value);
    });
};

export default store;
