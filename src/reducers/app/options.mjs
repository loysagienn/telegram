import {UPDATE} from 'actions';

export default (state = {}, action) => {
    if (action.type === UPDATE && action.update._ === 'updateOption') {
        const {name, value: {value}} = action.update;

        return Object.assign({}, state, {[name]: value});
    }

    return state;
};
