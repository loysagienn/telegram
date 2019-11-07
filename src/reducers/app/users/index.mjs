import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateUser') {
        const {user} = update;

        return Object.assign({}, state, {[user.id]: user});
    }

    return state;
};
