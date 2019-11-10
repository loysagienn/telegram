import {combineReducers} from 'redux';
import {app, lastAction} from 'reducers';

const ui = (state = {}) => state;

export default combineReducers({app, lastAction, ui});
