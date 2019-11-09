import {combineReducers} from 'redux';
import {app, lastAction} from 'reducers';
import {INIT_STATE, BATCH_ACTIONS, USE_LOCALSTORAGE_STATE} from 'actions';
import {LOCALSTORAGE_STATE_KEY} from 'config';


let localstorageState = null;

try {
    const stateStr = localStorage.getItem(LOCALSTORAGE_STATE_KEY);

    if (stateStr) {
        localstorageState = JSON.parse(stateStr);
    }
} catch (error) {
    console.log('get state from localstorage error');
}

let activeReducer;

const reducer = combineReducers({app, lastAction});

const reduceActions = (state, actions) => actions.reduce((acc, action) => reducer(acc, action), state);

const regularReducer = (state, action) => {
    if (action.type === INIT_STATE) {
        return action.state;
    }

    if (!state) {
        state = {};
    }

    if (action.type === BATCH_ACTIONS) {
        return reduceActions(state, action.actions);
    }

    return reducer(state, action);
};

const initialReducer = (state, action) => {
    if (action.type === INIT_STATE) {
        activeReducer = regularReducer;

        return regularReducer(state, action);
    }

    if (action.type === USE_LOCALSTORAGE_STATE) {
        activeReducer = regularReducer;

        console.log(localstorageState);

        return localstorageState;
    }

    localstorageState = regularReducer(localstorageState, action);

    return regularReducer(state, action);
};

activeReducer = localstorageState ? initialReducer : regularReducer;

export default (state, action) => activeReducer(state, action);
