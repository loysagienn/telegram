import {UPDATE} from 'actions';

export default (state = null, action) => {
    if (action.type === UPDATE && action.update._ === 'updateConnectionState') {
        return action.update.state._;
    }

    return state;
};
