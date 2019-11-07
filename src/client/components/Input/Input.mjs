import {createInput, createEmitter, destroyCallbacks, onInput} from 'ui';
import css from './Input.styl';

const valueSetter = input => value => input.value = value;

const renderInput = (placeholder) => {
    const input = createInput(css.input);

    input.placeholder = placeholder;

    return input;
};

const Input = ({currentValue = '', placeholder = ''} = {}) => {
    const inputNode = renderInput(placeholder);
    const setNodeValue = valueSetter(inputNode);

    const [destroy, callbacks] = destroyCallbacks(inputNode);
    const changeEmitter = createEmitter();
    callbacks.push(changeEmitter.off);

    setNodeValue(currentValue);

    const setValue = (value) => {
        currentValue = value;

        setNodeValue(value);
    };

    const onChange = () => {
        const {value} = inputNode;

        if (value === currentValue) {
            return;
        }

        currentValue = value;

        changeEmitter.emit(value);
    };

    callbacks.push(onInput(inputNode, onChange));

    return {
        node: inputNode,
        setValue,
        destroy,
        onChange: changeEmitter.on,
        offChange: changeEmitter.off,
        get value() { return currentValue; },
        focus: () => inputNode.focus(),
    };
};

export default Input;
