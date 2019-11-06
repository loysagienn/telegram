import {createDiv, destroyCallbacks} from 'ui';
import css from './MainLayout.styl';

const LoadingLayout = (parentNode) => {
    const rootNode = createDiv(css.root);
    const [, destroy] = destroyCallbacks(rootNode);

    rootNode.innerHTML = 'main layout';

    parentNode.appendChild(rootNode);

    return {
        node: rootNode,
        destroy,
    };
};

export default LoadingLayout;
