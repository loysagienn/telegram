const actionHandlers = () => {
    const handlers = {};

    const addActionHandler = (type, handler) => {
        if (Array.isArray(type)) {
            type.forEach(item => addActionHandler(item, handler));
        } else if (type in handlers) {
            handlers[type].push(handler);
        } else {
            handlers[type] = [handler];
        }
    };

    const applyHandler = (action, state) => {
        const {type} = action;

        if (type in handlers) {
            return handlers[type].reduce((acc, handler) => handler(acc, state), action);
        }

        return action;
    };

    const complementAction = ({getState}) => next => action => next(applyHandler(action, getState()));

    return {addActionHandler, applyHandler, complementAction};
};

export default actionHandlers;
