import {createSelector} from 'reselect';
// import {memoizeSimple} from 'utils';
import {selectUI, selectAuthorizationState} from './common';


export const selectAuthorizationLoading = createSelector(selectUI, ({authorizationLoading}) => authorizationLoading);

export const selectPhoneNumberInvalid = createSelector(selectUI, ({phoneNumberInvalid}) => phoneNumberInvalid);

export const selectPhoneCodeInvalid = createSelector(selectUI, ({phoneCodeInvalid}) => phoneCodeInvalid);

export const selectPasswordInvalid = createSelector(selectUI, ({passwordInvalid}) => passwordInvalid);

export const selectMonkey = createSelector(
    selectAuthorizationState,
    selectPhoneCodeInvalid,
    (authorizationState, phoneCodeInvalid) => {
        if (authorizationState === 'authorizationStateWaitCode') {
            if (phoneCodeInvalid) {
                return 'TwoFactorSetupMonkeyTracking';
            }

            return 'TwoFactorSetupMonkeyIdle';
        }

        if (authorizationState === 'authorizationStateWaitPassword') {
            return 'TwoFactorSetupMonkeyClose';
        }

        return null;
    },
);
