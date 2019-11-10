import {subscribeSelector} from 'client/store';
import {createDiv, destroyCallbacks, createText, onClick as addOnClick} from 'ui';
import LoadingIcon from '../LoadingIcon';
import css from './Button.styl';


const Button = ({text, onClick, className, loadingSelector}) => {
    const loadingIcon = LoadingIcon({color: '#ffffff', className: css.loadingIcon});
    const rootNode = createDiv(css.root, createText(text), loadingIcon.node);
    const [destroy, callbacks] = destroyCallbacks(rootNode);
    let isLoading = false;
    loadingIcon.node.style.display = 'none';

    if (className) {
        rootNode.classList.add(className);
    }

    if (loadingSelector) {
        callbacks.push(subscribeSelector(loadingSelector, (loading) => {
            isLoading = loading;

            if (loading) {
                loadingIcon.node.style.display = 'block';
            } else {
                loadingIcon.node.style.display = 'none';
            }
        }));
    }

    callbacks.push(addOnClick(rootNode, (event) => {
        if (!isLoading) {
            onClick(event);
        }
    }));

    return {
        node: rootNode,
        destroy,
    };
};


export default Button;
