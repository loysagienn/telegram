import {dispatch} from 'client/store';
import {setAuthCode} from 'actions';
import {createDiv, destroyCallbacks} from 'ui';
import Input from '../Input';
import Button from '../Button';
import css from './LoginLayout.styl';


const renderInput = () => {
    const input = Input({placeholder: 'Code'});

    return input;
};

const renderButton = (input) => {
    const button = Button({
        text: 'NEXT',
        onClick: () => dispatch(setAuthCode(input.value)),
        className: css.button,
    });

    return button;
};

const onInputChange = (callbacks, input, button) => {
    callbacks.push(input.onChange((value) => {
        if (value.trim()) {
            button.node.classList.add(css.visible);
        } else {
            button.node.classList.remove(css.visible);
        }
    }));
};

const WaitCode = (controlNode) => {
    const input = renderInput();
    const button = renderButton(input);
    const rootNode = createDiv(null, input.node, button.node);
    const [destroy, callbacks] = destroyCallbacks(rootNode);
    callbacks.push(() => input.destroy());
    callbacks.push(() => button.destroy());
    onInputChange(callbacks, input, button);

    controlNode.appendChild(rootNode);

    return {
        node: rootNode,
        destroy,
    };
};


export default WaitCode;
