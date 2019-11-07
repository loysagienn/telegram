import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE) {
        if (update._ === 'updateUser') {
            const {user: {profilePhoto}} = update;

            if (!profilePhoto) {
                return state;
            }

            const file = profilePhoto.small;

            return Object.assign({}, state, {[file.id]: file});
        }
        if (update._ === 'updateNewChat') {
            const {chat: {photo}} = update;

            if (!photo) {
                return state;
            }

            const file = photo.small;

            return Object.assign({}, state, {[file.id]: file});
        }
    }

    return state;
};
