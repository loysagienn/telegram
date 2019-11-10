import {dispatch} from 'client/store';
import {registerUser} from 'actions';
import {selectAuthorizationLoading} from 'selectors';
import {createDiv, destroyCallbacks, onKeyDown} from 'ui';
import {ENTER} from 'constants/keyCodes';
import Input from '../Input';
import Button from '../Button';
import css from './LoginLayout.styl';


const renderNameInput = (callbacks, onSubmit) => {
    const input = Input({title: 'Name'});

    callbacks.push(onKeyDown(input.inputNode, ({keyCode}) => {
        if (keyCode === ENTER) {
            onSubmit();
        }
    }));

    return input;
};

const renderLastNameInput = (callbacks, onSubmit) => {
    const input = Input({title: 'Last Name (optional)', className: css.lastNameInput});

    callbacks.push(onKeyDown(input.inputNode, ({keyCode}) => {
        if (keyCode === ENTER) {
            onSubmit();
        }
    }));

    return input;
};

const renderButton = (onSubmit) => {
    const button = Button({
        text: 'START MESSAGING',
        onClick: onSubmit,
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

const WaitRegistration = (controlNode) => {
    const callbacks = [];
    let submit = () => {};
    const lastNameInput = renderLastNameInput(callbacks, () => submit());
    const nameInput = renderNameInput(callbacks, () => lastNameInput.focus());
    const button = renderButton(() => submit());
    const rootNode = createDiv(null, nameInput.node, lastNameInput.node, button.node);

    const [destroy] = destroyCallbacks(rootNode, callbacks);
    callbacks.push(() => nameInput.destroy());
    callbacks.push(() => lastNameInput.destroy());
    callbacks.push(() => button.destroy());

    onInputChange(callbacks, nameInput, button);

    controlNode.appendChild(rootNode);

    requestAnimationFrame(() => nameInput.focus());

    submit = () => {
        const name = nameInput.value;

        if (!name.trim()) {
            nameInput.setInvalid(true, 'Name required');

            return;
        }

        const lastName = lastNameInput.value;

        dispatch(lastName ? registerUser(name, lastName) : registerUser(name));
    };

    return {
        node: rootNode,
        destroy,
    };
};


export default WaitRegistration;
