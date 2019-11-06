import {createDiv, destroyCallbacks, createText, onClick as addOnClick} from 'ui';
import css from './Button.styl';


const Button = ({text, onClick, className}) => {
    const rootNode = createDiv(css.root, createText(text));
    const [callbacks, destroy] = destroyCallbacks(rootNode);

    if (className) {
        rootNode.classList.add(className);
    }

    callbacks.push(addOnClick(rootNode, onClick));

    return {
        node: rootNode,
        destroy,
    };
};


export default Button;
