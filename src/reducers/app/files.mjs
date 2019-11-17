import {UPDATE, UPDATE_FILE} from 'actions';

export default (state = {}, action) => {
    const {type, update} = action;

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

        if (update._ === 'updateFile') {
            const {file} = update;

            return Object.assign({}, state, {[file.id]: file});
        }
    }

    if (type === UPDATE_FILE) {
        const {file} = action;

        return Object.assign({}, state, {[file.id]: file});
    }

    return state;
};
