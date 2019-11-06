import {UPDATE, SET_AUTH_PHONE} from 'actions';

export default (state = null, action) => {
    if (action.type === UPDATE) {
        if (
            action.update._ === 'updateAuthorizationState' &&
            action.update.authorizationState._ === 'authorizationStateWaitCode'
        ) {
            return action.update.authorizationState.codeInfo.phoneNumber;
        }
    }

    if (action.type === SET_AUTH_PHONE) {
        return action.phoneNumber;
    }

    return state;
};
