import {subscribeSelector} from 'client/store';
import {selectActiveChatId} from 'selectors';
import {createDiv, destroyCallbacks} from 'ui';
import ChatList from '../ChatList';
import ChatMessages from '../ChatMessages';
import css from './MainLayout.styl';

const renderChatList = (callbacks, contentNode) => {
    const chatList = ChatList();

    contentNode.appendChild(chatList.node);

    callbacks.push(() => chatList.destroy());

    return chatList;
};

const renderMessages = (callbacks, contentNode) => {
    let currentChat = null;

    callbacks.push(subscribeSelector(selectActiveChatId, (chatId) => {
        if (currentChat) {
            currentChat.hide();
        }

        if (chatId) {
            currentChat = ChatMessages(chatId, contentNode);
        }
    }));
};

const MainLayout = (parentNode) => {
    const contentNode = createDiv(css.content);
    const rootNode = createDiv(css.root, contentNode);
    const [destroy, callbacks] = destroyCallbacks(rootNode);
    renderChatList(callbacks, contentNode);
    renderMessages(callbacks, contentNode);


    parentNode.appendChild(rootNode);

    requestAnimationFrame(() => contentNode.classList.add(css.visible));

    return {
        node: rootNode,
        destroy,
    };
};

export default MainLayout;
