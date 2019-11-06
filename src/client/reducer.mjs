import {combineReducers} from 'redux';
import {app, lastAction} from 'reducers';
import {INIT_STATE} from 'actions';

const reducer = combineReducers({app, lastAction});

let activeReducer = (state, action) => {
    if (action.type === INIT_STATE) {
        activeReducer = reducer;

        return action.state;
    }

    if (!state) {
        return reducer({}, action);
    }

    return state;
};

export default (state, action) => activeReducer(state, action);
