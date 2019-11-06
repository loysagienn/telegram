import {UPDATE} from 'actions';

export default (state = null, action) => {
    if (action.type === UPDATE && action.update._ === 'updateAuthorizationState') {
        return action.update.authorizationState._;
    }

    return state;
};
