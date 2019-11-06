
import {createStore, applyMiddleware, compose} from 'redux';
import initActionHandlers from 'actionHandlers';
import reducer from './reducer';


const cerateReduxStore = () => {
    const actionHandlers = initActionHandlers();

    const store = createStore(reducer, {}, compose(applyMiddleware(actionHandlers.complementAction)));

    const {subscribe, getState, dispatch} = store;

    return {subscribe, getState, dispatch, store, actionHandlers};
};


export default cerateReduxStore;
