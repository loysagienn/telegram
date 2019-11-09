import {subscribeSelector} from 'client/store';
import {selectAuthorizationState} from 'selectors';
import {generateRandomString} from 'utils';
import {LOCALSTORAGE_USER_HASH_KEY} from 'config';

const getUserHash = () => {
    let userHash = localStorage.getItem(LOCALSTORAGE_USER_HASH_KEY);

    if (!userHash) {
        userHash = generateRandomString(30);

        localStorage.setItem(LOCALSTORAGE_USER_HASH_KEY, userHash);
    }

    subscribeSelector(selectAuthorizationState, (authorizationState) => {
        if (authorizationState === 'authorizationStateClosed') {
            localStorage.removeItem(LOCALSTORAGE_USER_HASH_KEY);

            window.location.reload();
        }
    });

    return userHash;
};

export default getUserHash;
