import {subscribeSelector} from 'client/store';
import {selectMainLayout} from 'selectors';
import {createDiv, destroyCallbacks} from 'ui';
import LoadingLayout from '../LoadingLayout';
import LoginLayout from '../LoginLayout';
import MainLayout from '../MainLayout';
import css from './App.styl';


const renderContent = (rootNode, layout, content) => {
    if (content) {
        content.destroy();
    }

    if (layout === 'main') {
        return MainLayout(rootNode);
    }

    if (layout === 'login') {
        return LoginLayout(rootNode);
    }

    return LoadingLayout(rootNode);
};

const App = () => {
    const rootNode = createDiv(css.app);
    const [destroy, callbacks] = destroyCallbacks();
    let content = null;

    callbacks.push(subscribeSelector(selectMainLayout, (layout) => {
        content = renderContent(rootNode, layout, content);
    }));

    document.body.appendChild(rootNode);

    return {
        destroy,
    };
};

export default App;
