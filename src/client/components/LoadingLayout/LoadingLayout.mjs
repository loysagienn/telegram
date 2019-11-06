import {createDiv, destroyCallbacks} from 'ui';
import css from './LoadingLayout.styl';

const loadingSvg = `<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
  <path fill="#62A4EF" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"></path>
</svg>`;

const LoadingLayout = (parentNode) => {
    const loadingNode = createDiv(css.loading);
    const rootNode = createDiv(css.root, loadingNode);
    const [, destroy] = destroyCallbacks(rootNode);

    loadingNode.innerHTML = loadingSvg;


    parentNode.appendChild(rootNode);

    return {
        node: rootNode,
        destroy,
    };
};

export default LoadingLayout;
