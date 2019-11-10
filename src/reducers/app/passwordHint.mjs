import {UPDATE} from 'actions';

export default (state = null, action) => {
    if (action.type === UPDATE) {
        if (
            action.update._ === 'updateAuthorizationState' &&
            action.update.authorizationState._ === 'authorizationStateWaitPassword'
        ) {
            return action.update.authorizationState.passwordHint;
        }
    }

    return state;
};
