import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE) {
        if (update._ === 'updateUser') {
            const {user} = update;

            return Object.assign({}, state, {[user.id]: user.status});
        }

        if (update._ === 'updateUserStatus') {
            const {userId, status} = update;

            return Object.assign({}, state, {[userId]: status});
        }
    }

    return state;
};
