import {createDiv, destroyCallbacks} from 'ui';
import LoadingIcon from '../LoadingIcon';
import css from './LoadingLayout.styl';


const LoadingLayout = (parentNode) => {
    const loadingIcon = LoadingIcon({className: css.icon});
    const loadingNode = createDiv(css.loading, loadingIcon.node);
    const rootNode = createDiv(css.root, loadingNode);
    const [destroy, callbacks] = destroyCallbacks(rootNode);

    // loadingNode.innerHTML = loadingSvg;


    parentNode.appendChild(rootNode);

    let showTimeout = setTimeout(() => {
        showTimeout = null;

        loadingNode.classList.add(css.visible);
    }, 1000);

    callbacks.push(() => {
        if (showTimeout) {
            clearTimeout(showTimeout);
        }
    });

    return {
        node: rootNode,
        destroy,
    };
};

export default LoadingLayout;
