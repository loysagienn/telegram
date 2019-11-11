import {createSelector} from 'reselect';
import {selectApp, selectAuthorizationState} from './common';

export * from './common';
export * from './user';
export * from './files';
export * from './chat';
export * from './ui';
export * from './selectChatStatus';

export const selectMainLayout = createSelector(selectAuthorizationState, (authorizationState) => {
    // return 'loading';
    if (
        authorizationState === 'authorizationStateWaitPhoneNumber'
        || authorizationState === 'authorizationStateWaitCode'
        || authorizationState === 'authorizationStateWaitRegistration'
        || authorizationState === 'authorizationStateWaitPassword'
    ) {
        return 'login';
    }

    if (authorizationState === 'authorizationStateReady') {
        return 'main';
    }

    return 'loading';
});

export const selectLastAction = ({lastAction}) => lastAction;

export const selectLastActionType = createSelector(selectLastAction, ({type}) => type);

export const selectPhoneNumber = createSelector(selectApp, ({phoneNumber}) => phoneNumber);

export const selectOptions = createSelector(selectApp, ({options}) => options);

export const selectMyId = createSelector(selectOptions, ({my_id}) => my_id || null);

