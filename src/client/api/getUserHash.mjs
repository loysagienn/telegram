import {generateRandomString} from 'utils';

const SORAGE_KEY = 'user_hash';

const getUserHash = () => {
    let userHash = localStorage.getItem(SORAGE_KEY);

    if (!userHash) {
        userHash = generateRandomString(30);

        localStorage.setItem(SORAGE_KEY, userHash);
    }

    return userHash;
};

export default getUserHash;
