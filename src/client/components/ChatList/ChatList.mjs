import {subscribeSelector} from 'client/store';
import {selectSortedChatList} from 'selectors';
import {createDiv, destroyCallbacks} from 'ui';
import css from './ChatList.styl';
import chatItems from './chatItems';
import Chat from './Chat';
import {CHAT_HEIGHT} from './constants';


const destroyChatItems = () => Object.keys(chatItems).forEach(key => chatItems[key].destroy());

const renderList = (chatList, itemsList, chatsContainer) => {
    chatsContainer.style.height = `${chatList.length * CHAT_HEIGHT}px`;

    console.log('render chat list');

    return chatList.map((chatId, index) => {
        const item = Chat(chatId);

        item.setOrder(index);

        if (!item.node.parentElement) {
            chatsContainer.appendChild(item.node);
        }

        return item;
    });
};

const ChatList = () => {
    const chatsContainer = createDiv(css.chatsContainer);
    const chatsWrapper = createDiv(css.chatsWrapper, chatsContainer);
    const rootNode = createDiv(css.root, chatsWrapper);
    const [destroy, callbacks] = destroyCallbacks(rootNode);
    let itemsList = [];

    callbacks.push(destroyChatItems);
    callbacks.push(subscribeSelector(selectSortedChatList, (chatList) => {
        itemsList = renderList(chatList, itemsList, chatsContainer);
    }));

    return {
        node: rootNode,
        destroy,
    };
};

export default ChatList;
