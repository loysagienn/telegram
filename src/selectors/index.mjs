import {createSelector} from 'reselect';
// import {createSelector} from 'utils';
import {selectApp} from './common';

export * from './common';
export * from './user';
export * from './files';
export * from './chat';

export const selectAuthorizationState = createSelector(selectApp, ({authorizationState}) => authorizationState);

export const selectMainLayout = createSelector(selectAuthorizationState, (authorizationState) => {
    if (
        authorizationState === 'authorizationStateWaitPhoneNumber'
        || authorizationState === 'authorizationStateWaitCode'
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

