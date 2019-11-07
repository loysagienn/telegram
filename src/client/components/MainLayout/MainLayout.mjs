import {createDiv, destroyCallbacks} from 'ui';
import ChatList from '../ChatList';
import css from './MainLayout.styl';

const renderChatList = (callbacks, contentNode) => {
    const chatList = ChatList();

    contentNode.appendChild(chatList.node);

    callbacks.push(() => chatList.destroy());

    return chatList;
};

const MainLayout = (parentNode) => {
    const contentNode = createDiv(css.content);
    const rootNode = createDiv(css.root, contentNode);
    const [destroy, callbacks] = destroyCallbacks(rootNode);
    const chatList = renderChatList(callbacks, contentNode);


    parentNode.appendChild(rootNode);

    return {
        node: rootNode,
        destroy,
    };
};

export default MainLayout;
