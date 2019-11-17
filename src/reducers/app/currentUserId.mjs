import {SET_CURRENT_USER} from 'actions';

export default (state = null, {type, user}) => {
    if (type === SET_CURRENT_USER) {
        return user.id;
    }

    return state;
};
