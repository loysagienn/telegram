import {createSelector} from 'reselect';
// import {createSelector} from 'utils';
import {selectApp} from './common';


export const selectFiles = createSelector(selectApp, ({files}) => files);
