import {UPDATE} from 'actions';

export default (state = {}, {type, update}) => {
    if (type === UPDATE && update._ === 'updateSupergroupFullInfo') {
        const {supergroupId, supergroupFullInfo} = update;

        return Object.assign({}, state, {[supergroupId]: supergroupFullInfo});
    }

    return state;
};
