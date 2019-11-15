import {subscribe, getState} from 'client/store';
import {selectLastActionType} from 'selectors';
import Ws from './ws';
import actionHandlers from './actionHandlers';

export const socket = new Ws();

subscribe(() => {
    const state = getState();
    const lastActionType = selectLastActionType(state);
    const handler = actionHandlers[lastActionType];

    if (handler) {
        const action = handler(state);

        if (action) {
            socket.send(action);
        }
    }
});
