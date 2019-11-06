import {UPDATE} from 'actions';

export default (state = {}, action) => {
    if (action.type === UPDATE && action.update._ === 'updateSelectedBackground') {
        return {darkTheme: action.update.forDarkTheme};
    }

    return state;
};
