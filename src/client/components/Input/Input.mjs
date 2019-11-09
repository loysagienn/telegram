import {createDiv, createInput, createEmitter, destroyCallbacks, onInput} from 'ui';
import {EventEmitter} from 'utils';
import css from './Input.styl';

const valueSetter = input => value => input.value = value;

const renderInput = (placeholder) => {
    const input = createInput(css.input);

    input.placeholder = placeholder;

    return input;
};

const Input = ({currentValue = '', placeholder = '', className} = {}) => {
    const inputNode = renderInput(placeholder);
    const rootNode = createDiv(css.root, inputNode);
    if (className) {
        rootNode.classList.add(className);
    }
    const setNodeValue = valueSetter(inputNode);
    let validator = null;

    const [destroy, callbacks] = destroyCallbacks(inputNode);
    const changeEmitter = createEmitter();
    callbacks.push(changeEmitter.off);

    setNodeValue(currentValue);

    const setValue = (value) => {
        currentValue = value;

        setNodeValue(value);
    };

    const onChange = () => {
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
    };
};

export default Input;
