import {UPDATE} from 'actions';

export default (state = null, {type, updateIndex}) => {
    if (type === UPDATE) {
        return updateIndex;
    }

    return state;
};
