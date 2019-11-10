import {createSelector} from 'reselect';
// import {memoizeSimple} from 'utils';
import {selectUI} from './common';


export const selectAuthorizationLoading = createSelector(selectUI, ({authorizationLoading}) => authorizationLoading);

export const selectPhoneNumberInvalid = createSelector(selectUI, ({phoneNumberInvalid}) => phoneNumberInvalid);

export const selectPhoneCodeInvalid = createSelector(selectUI, ({phoneCodeInvalid}) => phoneCodeInvalid);
