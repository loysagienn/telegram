import {createSelector} from 'reselect';
import {memoizeSimple} from 'utils';
import {selectApp} from './common';


export const selectFiles = createSelector(selectApp, ({files}) => files);

export const selectFile = memoizeSimple(fileId => createSelector(
    selectFiles,
    files => (files[fileId] || null),
));
