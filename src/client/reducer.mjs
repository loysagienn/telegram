import {combineReducers} from 'redux';
import {app, lastAction, ui, lastUpdateIndex, savedApp, instanceHash} from 'reducers';
import {INIT_STATE, BATCH_ACTIONS} from 'actions';
// import {getStateFromLocalstorage} from 'client/localstorage';


let activeReducer;

const reducer = combineReducers({app, lastAction, ui, lastUpdateIndex, savedApp, instanceHash});

const regularReducer = (state, action) => {
    if (action.type === INIT_STATE) {
        activeReducer = regularReducer;

        if (action.useSavedState) {
            return Object.assign({}, state, {
                app: state.savedApp || state.app,
                savedApp: null,
            });
        }

        return Object.assign({}, state, {
            app: action.state.app,
            savedApp: null,
            instanceHash: action.instanceHash,
            lastUpdateIndex: action.lastUpdateIndex,
            lastAction: action,
        });
    }

    if (!state) {
        state = {};
    }

    if (action.type === BATCH_ACTIONS) {
        return action.actions.reduce((acc, actionItem) => activeReducer(acc, actionItem), state);
    }

    return reducer(state, action);
};

// const initialReducer = (state, action) => {
//     if (action.type === INIT_STATE) {
//         activeReducer = regularReducer;

//         if (action.useSavedState) {
//             return Object.assign({}, state, {
//                 app: state.savedApp,
//                 savedApp: {},
//             });
//         }
//         return Object.assign({}, state, {
//             app: action.state.app,
//             savedApp: {},
//             instanceHash: action.instanceHash,
//         });
//     }

//     return regularReducer(state, action);
// };

activeReducer = regularReducer;

export default (state, action) => activeReducer(state, action);
