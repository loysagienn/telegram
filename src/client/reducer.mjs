import {combineReducers} from 'redux';
import {app, lastAction, ui, lastUpdateIndex, savedApp, instanceHash} from 'reducers';
import {INIT_STATE, BATCH_ACTIONS} from 'actions';
// import {getStateFromLocalstorage} from 'client/localstorage';


const reducer = combineReducers({app, lastAction, ui, lastUpdateIndex, savedApp, instanceHash});

const regularReducer = (state, action) => {
    if (action.type === BATCH_ACTIONS) {
        return action.actions.reduce((acc, actionItem) => regularReducer(acc, actionItem), state);
    }

    if (action.type === INIT_STATE) {
        if (action.useSavedState) {
            return reducer(Object.assign({}, state, {
                app: state.savedApp || state.app,
                savedApp: null,
            }), action);
        }

        return reducer(Object.assign({}, state, {
            app: action.state.app,
            savedApp: null,
            instanceHash: action.instanceHash,
            lastUpdateIndex: action.lastUpdateIndex,
            lastAction: action,
        }), action);
    }

    if (!state) {
        state = {};
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

export default (state, action) => regularReducer(state, action);
