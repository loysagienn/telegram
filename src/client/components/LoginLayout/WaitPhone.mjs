import {dispatch} from 'client/store';
import {setAuthPhone} from 'actions';
import {createDiv, createText, destroyCallbacks, onClick, onFocus, onBlur, onMouseDown, onMouseEnter} from 'ui';
import {countryCodes, countries, countriesByPhone} from 'constants';
import Input from '../Input';
import Button from '../Button';
import css from './LoginLayout.styl';

const getCountryByPhone = (phone) => {
    phone = phone.replace(/[^0-9]/ig, '');

    for (let i = 3; i > 0; i--) {
        const countryCode = phone.substr(0, i);

        if (countriesByPhone[countryCode]) {
            return countriesByPhone[countryCode];
        }
    }

    return null;
};

const renderCountry = (root, {code, name, phone, emoji}, onSelectCountry, countryInput, callbacks) => {
    const flagNode = createDiv(css.countryFlag, createText(emoji));
    const nameNode = createDiv(css.countryName, createText(name));
    const phoneNode = createDiv(css.countryPhone, createText(`+${phone}`));
    const node = createDiv(css.country, flagNode, nameNode, phoneNode);

    callbacks.push(onClick(node, () => onSelectCountry({code, name, phone, emoji})));
    callbacks.push(onMouseEnter(node, () => countryInput.inputNode.placeholder = name));

    root.appendChild(node);

    const filter = (substr) => {
        if (!substr) {
            node.classList.remove(css.hidden);

            nameNode.innerHTML = name;

            return;
        }

        const regexp = new RegExp(substr, 'i');
        const match = name.match(regexp);

        if (!match) {
            node.classList.add(css.hidden);
        } else {
            node.classList.remove(css.hidden);
            const {0: matchStr, index} = match;

            nameNode.innerHTML = `${name.substr(0, index)}<span class="${css.boldPart}">${matchStr}</span>${name.substr(index + matchStr.length)}`;
        }
    };

    return {
        node,
        filter,
    };
};

const renderCountries = (countryInput, callbacks, phoneInput) => {
    const countriesList = createDiv(css.countriesList);
    const countriesRoot = createDiv(css.countriesRoot, countriesList);
    let currentCountryCode = null;

    callbacks.push(onMouseDown(countriesRoot, event => event.preventDefault()));
    callbacks.push(onFocus(countryInput.inputNode, () => countriesRoot.classList.add(css.visible)));
    callbacks.push(onBlur(countryInput.inputNode, () => countriesRoot.classList.remove(css.visible)));

    let countryItems = [];

    const onSelectCountry = ({phone, name, code}) => {
        currentCountryCode = code;
        countryInput.setValue(name);
        countryItems.forEach(item => item.filter());
        phoneInput.setValue(`+${phone} `);
        phoneInput.focus();
    };

    callbacks.push(onBlur(countryInput.inputNode, () => countryInput.inputNode.placeholder = 'Country'));

    countryItems = countryCodes.map(
        code => renderCountry(countriesList, countries[code], onSelectCountry, countryInput, callbacks),
    );

    callbacks.push(countryInput.onChange(value => countryItems.forEach(item => item.filter(value))));

    callbacks.push(phoneInput.onChange((value) => {
        const country = getCountryByPhone(value);

        if (country) {
            if (currentCountryCode === country.code) {
                return;
            }

            countryInput.setValue(country.name);

            currentCountryCode = country.code;
        } else {
            currentCountryCode = null;
            countryInput.setValue('');
        }
    }));

    return {
        node: countriesRoot,
    };
};

const renderCountryInput = () => {
    const input = Input({placeholder: 'Country', className: css.countryInput});

    return input;
};

const renderPhoneInput = (callbacks) => {
    const input = Input({placeholder: 'Phone Number'});

    input.inputNode.type = 'tel';

    callbacks.push(input.setValidator((value) => {
        value = value.replace(/[-–—−]/ig, ' ');
        value = value.replace(/[^+ 0-9]/ig, '');
        if (value && value.charAt(0) !== '+') {
            value = `+${value}`;
        }

        return value;
    }));

    callbacks.push(onFocus(input.inputNode, () => {
        if (!input.value) {
            input.setValue('+');
        }
    }));

    return input;
};

const renderButton = (input) => {
    const button = Button({
        text: 'NEXT',
        onClick: () => dispatch(setAuthPhone(input.value)),
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


const WaitPhone = (controlNode) => {
    const callbacks = [];
    const countryInput = renderCountryInput();
    const phoneInput = renderPhoneInput(callbacks);
    const countriesComp = renderCountries(countryInput, callbacks, phoneInput);
    const button = renderButton(phoneInput);
    const rootNode = createDiv(css.waitPhone, countriesComp.node, countryInput.node, phoneInput.node, button.node);
    const [destroy] = destroyCallbacks(rootNode, callbacks);
    callbacks.push(() => phoneInput.destroy());
    callbacks.push(() => button.destroy());
    onInputChange(callbacks, phoneInput, button);

    controlNode.appendChild(rootNode);


    callbacks.push(onFocus(countryInput.inputNode, () => {
        if (window.innerHeight < 800) {
            rootNode.classList.add(css.big);
        }
    }));
    callbacks.push(onBlur(countryInput.inputNode, () => rootNode.classList.remove(css.big)));

    return {
        node: rootNode,
        destroy,
    };
};


export default WaitPhone;
