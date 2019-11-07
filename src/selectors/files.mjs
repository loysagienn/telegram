import {createSelector} from 'reselect';
// import {memoizeSimple} from 'utils';
import {selectApp} from './common';


export const selectFiles = createSelector(selectApp, ({files}) => files);
