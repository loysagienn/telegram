import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateSupergroup') {
        const {supergroup} = update;

        return Object.assign({}, state, {[supergroup.id]: supergroup});
    }

    return state;
};
