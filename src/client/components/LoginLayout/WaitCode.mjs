import {dispatch, subscribeSelector} from 'client/store';
import {setAuthCode} from 'actions';
import {selectAuthorizationLoading, selectPhoneCodeInvalid} from 'selectors';
import {createDiv, destroyCallbacks, onKeyDown} from 'ui';
import {ENTER} from 'constants/keyCodes';
import Input from '../Input';
import Button from '../Button';
import css from './LoginLayout.styl';


const renderInput = (callbacks) => {
    const input = Input({title: 'Code'});

    input.inputNode.type = 'tel';

    callbacks.push(onKeyDown(input.inputNode, ({keyCode}) => {
        if (keyCode === ENTER) {
            dispatch(setAuthCode(input.value));
        }
    }));

    return input;
};

const renderButton = (input) => {
    const button = Button({
        text: 'NEXT',
        onClick: () => dispatch(setAuthCode(input.value)),
        className: css.button,
        loadingSelector: selectAuthorizationLoading,
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
    const callbacks = [];
    const input = renderInput(callbacks);
    const button = renderButton(input);
    const rootNode = createDiv(null, input.node, button.node);
    const [destroy] = destroyCallbacks(rootNode, callbacks);
    callbacks.push(() => input.destroy());
    callbacks.push(() => button.destroy());
    onInputChange(callbacks, input, button);

    controlNode.appendChild(rootNode);

    requestAnimationFrame(() => input.focus());

    callbacks.push(subscribeSelector(selectPhoneCodeInvalid, (phoneCodeInvalid) => {
        if (phoneCodeInvalid) {
            input.setInvalid(true, 'Invalid Code');
        }
    }));

    return {
        node: rootNode,
        destroy,
    };
};


export default WaitCode;
