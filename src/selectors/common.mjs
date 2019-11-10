import {createSelector} from 'reselect';

export const selectApp = ({app}) => app;

export const selectUI = ({ui}) => ui;

export const selectAuthorizationState = createSelector(selectApp, ({authorizationState}) => authorizationState);
