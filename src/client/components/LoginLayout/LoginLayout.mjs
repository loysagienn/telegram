import {subscribeSelector, select} from 'client/store';
import {selectPhoneNumber, selectAuthorizationState} from 'selectors';
import {createDiv, createText, destroyCallbacks} from 'ui';
import WaitPhone from './WaitPhone';
import WaitCode from './WaitCode';
import css from './LoginLayout.styl';

const logoSvg = `<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" id="svg15" viewBox="0 0 240 240" version="1.1">
  <circle id="circle11" fill="#62A4EF" r="120" cy="120" cx="120"/>
  <path id="path13" fill="#fff" d="m44.691 125.87c14.028-7.7268 29.687-14.176 44.318-20.658 25.171-10.617 50.442-21.05 75.968-30.763 4.9664-1.6549 13.89-3.2731 14.765 4.0866-0.47934 10.418-2.4503 20.775-3.8021 31.132-3.4313 22.776-7.3975 45.474-11.265 68.175-1.3326 7.5618-10.805 11.476-16.866 6.6369-14.566-9.8386-29.244-19.582-43.624-29.649-4.7105-4.7863-0.34239-11.66 3.8645-15.078 11.997-11.823 24.72-21.868 36.09-34.302 3.067-7.4061-5.9951-1.1645-8.9842 0.74815-16.424 11.318-32.446 23.327-49.762 33.274-8.845 4.8689-19.154 0.70809-27.995-2.0087-7.9269-3.2821-19.543-6.5888-12.708-11.593z"/>
</svg>`;

const renderLogo = () => {
    const node = createDiv(css.logo);

    node.innerHTML = logoSvg;

    return node;
};

const renderHeader = () => {
    const headerText = createText();
    const helpText = createText();
    const title = createDiv(css.title, headerText);
    const help = createDiv(css.helpText, helpText);
    const header = createDiv(css.header, title, help);

    return [header, headerText, helpText];
};

const setHeaderText = headerText => (authorizationState) => {
    if (authorizationState === 'authorizationStateWaitCode') {
        headerText.textContent = select(selectPhoneNumber);
    } else if (authorizationState === 'authorizationStateWaitPhoneNumber') {
        headerText.textContent = 'Sign in to Telegram';
    } else {
        headerText.textContent = 'Authorization';
    }
};

const setHelpText = helpText => (authorizationState) => {
    if (authorizationState === 'authorizationStateWaitCode') {
        helpText.textContent = 'We have sent you a message with the code.';
    } else if (authorizationState === 'authorizationStateWaitPhoneNumber') {
        helpText.textContent = 'Please enter your phone number.';
    } else {
        helpText.textContent = `Authorization state ${authorizationState}`;
    }
};

const renderControl = (controlNode, authorizationState, control) => {
    if (control) {
        control.destroy();
    }

    if (authorizationState === 'authorizationStateWaitCode') {
        return WaitCode(controlNode);
    }

    return WaitPhone(controlNode);
};

const LoginLayout = (parentNode) => {
    let control = null;
    const logoNode = renderLogo();
    const [headerNode, headerText, helpText] = renderHeader();
    const controlNode = createDiv();
    const layoutNode = createDiv(css.layout, logoNode, headerNode, controlNode);
    const flexWrapper = createDiv(css.flexWrapper, layoutNode);
    const rootNode = createDiv(css.root, flexWrapper);
    const [destroy, callbacks] = destroyCallbacks(rootNode);

    callbacks.push(subscribeSelector(selectAuthorizationState, setHeaderText(headerText)));
    callbacks.push(subscribeSelector(selectAuthorizationState, setHelpText(helpText)));

    callbacks.push(subscribeSelector(selectAuthorizationState, (authorizationState) => {
        control = renderControl(controlNode, authorizationState, control);
    }));

    parentNode.appendChild(rootNode);

    return {
        node: rootNode,
        destroy,
    };
};

export default LoginLayout;
