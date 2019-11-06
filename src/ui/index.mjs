
export const createElement = tag => (className, ...children) => {
    const element = document.createElement(tag);

    if (className) {
        element.classList.add(className);
    }

    children.forEach(child => element.appendChild(child));

    return element;
};

export const createDiv = createElement('div');
export const createInput = createElement('input');

export const createText = (text = '') => document.createTextNode(text);

export const addEvent = event => (element, callback) => {
    element.addEventListener(event, callback);

    return () => element.removeEventListener(event, callback);
};

export const onClick = addEvent('click');
export const onInput = addEvent('input');

export const destroyCallbacks = (domNode) => {
    const callbacks = [];
    const destroy = () => {
        if (domNode && domNode.parentNode) {
            domNode.parentNode.removeChild(domNode);
        }
        callbacks.forEach(callback => callback());
    };

    return [callbacks, destroy];
};

export const createEmitter = () => {
    let events = [];

    const off = (callback) => {
        if (!callback) {
            events = [];
        }

        const index = events.indexOf(callback);

        if (index !== -1) {
            events.splice(index, 1);
        }
    };

    const on = (callback) => {
        events.push(callback);

        return () => off(callback);
    };

    const emit = (...args) => events.forEach(event => event(...args));

    return {on, off, emit};
};
