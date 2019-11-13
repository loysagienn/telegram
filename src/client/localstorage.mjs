
import {LOCALSTORAGE_STATE_KEY} from 'config';


export const getStateFromLocalstorage = () => {
    try {
        const data = localStorage.getItem(LOCALSTORAGE_STATE_KEY);

        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('get state from localstorage error');
    }

    return {};
};
