import {createSelector} from 'reselect';
import {memoizeSimple} from 'utils';
import {selectApp} from './common';
import {selectFiles} from './files';


export const selectUsers = createSelector(selectApp, ({users}) => users);

export const selectUser = memoizeSimple(userId => createSelector(selectUsers, users => (users[userId] || null)));

export const selectUsersFullInfo = createSelector(selectApp, ({usersFullInfo}) => usersFullInfo);

export const selectUserFullInfo = memoizeSimple(
    userId => createSelector(selectUsersFullInfo, userFullInfo => (userFullInfo[userId] || null)),
);

export const selectUserStatuses = createSelector(selectApp, ({userStatuses}) => userStatuses);

export const selectUserStatus = memoizeSimple(
    userId => createSelector(selectUserStatuses, userStatuses => (userStatuses[userId] || null)),
);

export const selectUserPhotoFile = memoizeSimple(
    userId => createSelector(selectUser(userId), selectFiles, (user, files) => {
        if (!user.profilePhoto) {
            return null;
        }

        const fileId = user.profilePhoto.small.id;

        return files[fileId] || null;
    }),
);
