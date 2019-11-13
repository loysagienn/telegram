
export const createElement = tag => (className, ...children) => {
    const element = document.createElement(tag);

    if (className) {
        element.classList.add(className);
    }

    children.forEach(child => element.appendChild(child));

    return element;
};

export const createDiv = createElement('div');
export const createSpan = createElement('span');
export const createInput = createElement('input');

export const createText = (text = '') => document.createTextNode(text);

export const addEvent = event => (element, callback) => {
    element.addEventListener(event, callback);

    return () => element.removeEventListener(event, callback);
};

export const onClick = addEvent('click');
export const onInput = addEvent('input');
export const onFocus = addEvent('focus');
export const onBlur = addEvent('blur');
export const onMouseDown = addEvent('mousedown');
export const onMouseEnter = addEvent('mouseenter');
export const onError = addEvent('error');
export const onKeyDown = addEvent('keydown');
export const onScroll = (element, callback) => {
    element.addEventListener('scroll', callback, {passive: true});

    return () => element.removeEventListener('scroll', callback);
};

// class Callbacks extends Array {
//     constructor(...args) {
//         super(...args);

//         this.forEach((item) => {
//             if (typeof item !== 'function') {
//                 console.trace();
//             }
//         });
//     }
//     push(item) {
//         console.log('push item', typeof item);
//         if (typeof item !== 'function') {
//             console.trace();
//         }

//         super.push(item);
//     }
// }

export const destroyCallbacks = (domNode, callbacks = []) => {
    // const callbacks = new Callbacks(...callbacksArgs);
    const destroy = () => {
        if (domNode && domNode.parentNode) {
            domNode.parentNode.removeChild(domNode);
        }
        callbacks.forEach(callback => callback());
    };

    return [destroy, callbacks];
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
