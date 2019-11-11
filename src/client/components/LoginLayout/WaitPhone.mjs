import {dispatch, subscribeSelector} from 'client/store';
import {setAuthPhone} from 'actions';
import {selectAuthorizationLoading, selectPhoneNumberInvalid} from 'selectors';
import {createDiv, createText, destroyCallbacks, onClick, onFocus, onBlur, onMouseDown, onMouseEnter, onKeyDown} from 'ui';
import {countryCodes, countries, countriesByPhone} from 'countries';
import {ENTER, ARROW_DOWN, ARROW_UP} from 'constants/keyCodes';
import Input from '../Input';
import Button from '../Button';
import css from './LoginLayout.styl';

const isTouchDevice = 'ontouchstart' in document.documentElement;

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

let focusedCountry = null;

const focusCountry = (item, countryInput) => {
    if (focusedCountry) {
        focusedCountry.node.classList.remove(css.focused);
    }

    if (!item) {
        focusedCountry = null;

        countryInput.inputNode.placeholder = '';

        return;
    }

    item.node.classList.add(css.focused);
    countryInput.inputNode.placeholder = item.name;

    focusedCountry = item;
};

const renderCountry = (root, {code, name, phone, emoji}, onSelectCountry, countryInput, callbacks) => {
    const flagNode = createDiv(css.countryFlag, createText(emoji));
    const nameNode = createDiv(css.countryName, createText(name));
    const phoneNode = createDiv(css.countryPhone, createText(`+${phone}`));
    const node = createDiv(css.country, flagNode, nameNode, phoneNode);

    callbacks.push(onClick(node, () => onSelectCountry({code, name, phone, emoji})));

    root.appendChild(node);

    const filter = (substr) => {
        if (!substr) {
            node.classList.remove(css.hidden);

            nameNode.innerHTML = name;

            return true;
        }

        const regexp = new RegExp(substr, 'i');
        const match = name.match(regexp);

        if (!match) {
            node.classList.add(css.hidden);

            if (focusedCountry && focusedCountry.code === code) {
                focusCountry(null, countryInput);
            }

            return false;
        }

        node.classList.remove(css.hidden);
        const {0: matchStr, index} = match;

        nameNode.innerHTML = `${name.substr(0, index)}<span class="${css.boldPart}">${matchStr}</span>${name.substr(index + matchStr.length)}`;

        return true;
    };

    const item = {
        code,
        name,
        phone,
        emoji,
        node,
        filter,
    };

    if (!isTouchDevice) {
        callbacks.push(onMouseEnter(node, () => focusCountry(item, countryInput)));
    }
    callbacks.push(onBlur(countryInput.inputNode, () => focusCountry(null, countryInput)));

    return item;
};

const renderCountries = (countryInput, callbacks, phoneInput) => {
    const emptyList = createDiv(css.emptyList, createText('No countries found'));
    const countriesList = createDiv(css.countriesList, emptyList);
    const countriesRoot = createDiv(css.countriesRoot, countriesList);
    let currentCountryCode = null;
    let countryItems = [];
    let visibleItems = [];

    const filterItems = (value) => {
        visibleItems = [];

        countryItems.forEach((item) => {
            const isVisible = item.filter(value);

            if (isVisible) {
                visibleItems.push(item);
            }
        });

        if (visibleItems.length) {
            emptyList.classList.remove(css.visible);
        } else {
            emptyList.classList.add(css.visible);
        }
    };

    const onSelectCountry = ({phone, name, code}) => {
        currentCountryCode = code;
        countryInput.setValue(name);
        filterItems(null);
        phoneInput.setValue(`+${phone} `);
        phoneInput.focus();
    };

    countryItems = countryCodes.map(
        code => renderCountry(countriesList, countries[code], onSelectCountry, countryInput, callbacks),
    );
    visibleItems = countryItems;

    callbacks.push(onMouseDown(countriesRoot, event => event.preventDefault()));
    callbacks.push(onFocus(countryInput.inputNode, () => {
        countriesRoot.classList.add(css.visible);
    }));
    callbacks.push(onBlur(countryInput.inputNode, () => {
        countriesRoot.classList.remove(css.visible);
        countryInput.inputNode.placeholder = '';
    }));

    callbacks.push(countryInput.onChange(filterItems));

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

    callbacks.push(onKeyDown(countryInput.inputNode, (event) => {
        const {keyCode} = event;

        if (keyCode === ENTER) {
            if (focusedCountry) {
                onSelectCountry(focusedCountry);
            } else if (visibleItems.length === 1) {
                onSelectCountry(visibleItems[0]);
            }
        }

        if (keyCode === ARROW_DOWN) {
            if (visibleItems.length === 0) {
                return;
            }

            let index = 0;

            if (focusedCountry) {
                const currentIndex = visibleItems.indexOf(focusedCountry);

                index = Math.min(currentIndex + 1, visibleItems.length - 1);
            }

            focusCountry(visibleItems[index], countryInput);
        }

        if (keyCode === ARROW_UP) {
            event.preventDefault();

            if (visibleItems.length === 0) {
                return;
            }

            let index = -1;

            if (focusedCountry) {
                const currentIndex = visibleItems.indexOf(focusedCountry);

                index = currentIndex - 1;
            }

            if (index === -1) {
                focusCountry(null, countryInput);
            } else {
                focusCountry(visibleItems[index], countryInput);
            }
        }
    }));

    return {
        node: countriesRoot,
    };
};

const renderCountryInput = () => {
    const input = Input({title: 'Country', className: css.countryInput});

    return input;
};

const renderPhoneInput = (callbacks) => {
    const input = Input({title: 'Phone Number'});

    input.inputNode.type = 'tel';

    input.setValidator((value) => {
        value = value.replace(/[-–—−]/ig, ' ');
        value = value.replace(/[^+ 0-9]/ig, '');
        if (value && value.charAt(0) !== '+') {
            value = `+${value}`;
        }

        return value;
    });

    callbacks.push(onKeyDown(input.inputNode, ({keyCode}) => {
        if (keyCode === ENTER) {
            dispatch(setAuthPhone(input.value));
        }
    }));

    callbacks.push(onFocus(input.inputNode, () => {
        if (!input.value) {
            input.setValue('+');
        }
    }));

    callbacks.push(onBlur(input.inputNode, () => {
        if (input.value.trim() === '+') {
            input.setValue('');
        }
    }));

    return input;
};

const renderButton = (input) => {
    const button = Button({
        text: 'NEXT',
        onClick: () => dispatch(setAuthPhone(input.value)),
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


const WaitPhone = (controlNode) => {
    const callbacks = [];
    const countryInput = renderCountryInput();
    const phoneInput = renderPhoneInput(callbacks);
    const countriesComp = renderCountries(countryInput, callbacks, phoneInput);
    const button = renderButton(phoneInput, callbacks);
    const rootNode = createDiv(css.waitPhone, countryInput.node, phoneInput.node, button.node, countriesComp.node);
    const [destroy] = destroyCallbacks(rootNode, callbacks);
    callbacks.push(() => countryInput.destroy());
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

    callbacks.push(subscribeSelector(selectPhoneNumberInvalid, (phoneNumberInvalid) => {
        if (phoneNumberInvalid) {
            phoneInput.setInvalid(true, 'Invalid Phone Number');
        }
    }));

    return {
        node: rootNode,
        destroy,
    };
};


export default WaitPhone;
