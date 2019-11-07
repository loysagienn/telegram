import {subscribeSelector, select} from 'client/store';
import {selectChatList} from 'selectors';
import {createDiv, destroyCallbacks} from 'ui';
import css from './ChatList.styl';
import chatItems from './chatItems';
import Chat from './Chat';


const destroyChatItems = () => Object.keys(chatItems).forEach(key => chatItems[key].destroy());

const renderList = (chatList, itemsList, rootNode) => {
    rootNode.innerHTML = '';

    return chatList.map((chatId) => {
        const item = Chat(chatId);

        rootNode.appendChild(item.node);

        return item;
    });
};

const ChatList = () => {
    const rootNode = createDiv(css.root);
    const [destroy, callbacks] = destroyCallbacks(rootNode);
    let itemsList = [];

    callbacks.push(destroyChatItems);
    callbacks.push(subscribeSelector(selectChatList, (chatList) => {
        itemsList = renderList(chatList, itemsList, rootNode);
    }));

    return {
        node: rootNode,
        destroy,
    };
};

export default ChatList;
