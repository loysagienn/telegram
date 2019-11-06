import {createSelector} from 'reselect';

export const selectApp = ({app}) => app;

export const selectAuthorizationState = createSelector(selectApp, ({authorizationState}) => authorizationState);

export const selectMainLayout = createSelector(selectAuthorizationState, (authorizationState) => {
    if (
        authorizationState === 'authorizationStateWaitPhoneNumber'
        || authorizationState === 'authorizationStateWaitCode'
    ) {
        return 'login';
    }

    return 'loading';
});

export const selectLastAction = ({lastAction}) => lastAction;

export const selectLastActionType = createSelector(selectLastAction, ({type}) => type);
