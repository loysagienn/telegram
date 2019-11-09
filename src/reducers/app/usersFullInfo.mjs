import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateUserFullInfo') {
        const {userId, userFullInfo} = update;

        return Object.assign({}, state, {[userId]: userFullInfo});
    }

    return state;
};
