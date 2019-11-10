import {
    createDiv,
    createText,
    createInput,
    createEmitter,
    destroyCallbacks,
    onInput,
    onFocus,
    onBlur,
} from 'ui';
// import {EventEmitter} from 'utils';
import css from './Input.styl';

const renderInput = () => {
    const input = createInput(css.input);

    return input;
};

const renderTitle = (textStr, inputNode, callbacks) => {
    const text = createText(textStr);
    const node = createDiv(css.title, text);

    const takeUp = () => node.classList.add(css.up);
    const moveDown = () => node.classList.remove(css.up);

    callbacks.push(onFocus(inputNode, () => {
        node.classList.add(css.focused);
        takeUp();
    }));

    callbacks.push(onBlur(inputNode, () => {
        node.classList.remove(css.focused);
        if (!inputNode.value) {
            moveDown();
        }
    }));

    return {
        text,
        node,
        takeUp,
        moveDown,
    };
};

const renderBorder = (inputNode, callbacks) => {
    const node = createDiv(css.border);

    callbacks.push(onFocus(inputNode, () => node.classList.add(css.focused)));
    callbacks.push(onBlur(inputNode, () => node.classList.remove(css.focused)));

    return {node};
};

const Input = ({currentValue = '', title: titleText = '', className} = {}) => {
    const changeEmitter = createEmitter();
    const callbacks = [];
    const inputNode = renderInput();
    const title = renderTitle(titleText, inputNode, callbacks);
    const border = renderBorder(inputNode, callbacks);
    const rootNode = createDiv(css.root, border.node, title.node, inputNode);
    if (className) {
        rootNode.classList.add(className);
    }

    let isInputInvalid = false;

    const setInvalid = (isInvalid, invalidText) => {
        if (isInvalid === isInputInvalid) {
            return;
        }

        isInputInvalid = isInvalid;

        if (isInvalid) {
            title.text.textContent = invalidText;
            rootNode.classList.add(css.invalid);
        } else {
            title.text.textContent = titleText;
            rootNode.classList.remove(css.invalid);
        }
    };

    const setNodeValue = (value) => {
        inputNode.value = value;

        setInvalid(false);

        if (value || inputNode.placeholder) {
            title.takeUp();
        } else {
            title.moveDown();
        }
    };
    let validator = null;

    const [destroy] = destroyCallbacks(inputNode, callbacks);
    callbacks.push(changeEmitter.off);

    setNodeValue(currentValue);

    const setValue = (value) => {
        currentValue = value;

        setNodeValue(value);
    };

    const onChange = () => {
        setInvalid(false);

        let {value} = inputNode;

        if (validator) {
            const validValue = validator(value);

            if (validValue !== value) {
                setNodeValue(validValue);
            }

            value = validValue;
        }

        if (value === currentValue) {
            return;
        }

        currentValue = value;

        changeEmitter.emit(value);
    };

    callbacks.push(onInput(inputNode, onChange));

    return {
        node: rootNode,
        inputNode,
        setValue,
        destroy,
        setValidator: val => validator = val,
        onChange: changeEmitter.on,
        offChange: changeEmitter.off,
        get value() { return currentValue; },
        focus: () => inputNode.focus(),
        setInvalid,
    };
};

export default Input;
