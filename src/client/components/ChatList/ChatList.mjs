import {subscribeSelector, dispatch, select} from 'client/store';
import {selectSortedChatList, selectChatOrder} from 'selectors';
import {loadChats} from 'actions';
import {createDiv, destroyCallbacks, onScroll} from 'ui';
import {throttle} from 'utils';
import css from './ChatList.styl';
import chatItems from './chatItems';
import Chat from './Chat';
import {CHAT_HEIGHT} from './constants';


let lastLoadChatsCount = 0;

const throttledLoadChats = (lastChatOrder, chatsCount) => {
    if (chatsCount === lastLoadChatsCount) {
        return;
    }

    lastLoadChatsCount = chatsCount;

    dispatch(loadChats(lastChatOrder));
};

const destroyChatItems = () => Object.keys(chatItems).forEach(key => chatItems[key].destroy());

const renderList = (chatList, chatsContainer, rootNode, previousItems) => {
    chatsContainer.style.height = `${chatList.length * CHAT_HEIGHT}px`;

    const top = rootNode.scrollTop;
    const bottom = window.innerHeight + top;

    if (rootNode.scrollHeight > 0 && rootNode.scrollHeight - bottom < 1000) {
        let lastChatOrder = null;
        let index = chatList.length - 1;

        while (index > 0 && lastChatOrder === null) {
            lastChatOrder = select(selectChatOrder(chatList[index]));

            index--;
        }

        if (lastChatOrder) {
            throttledLoadChats(lastChatOrder, chatList.length);
        }
    }

    const start = Math.max(0, Math.round((top / CHAT_HEIGHT) - 10));
    const end = Math.min(chatList.length - 1, Math.round((bottom / CHAT_HEIGHT) + 10));

    const nextItems = {};

    for (let i = start; i <= end; i++) {
        const chatId = chatList[i];

        const item = Chat(chatId, chatsContainer);

        item.setOrder(i);

        nextItems[chatId] = item;

        if (chatId in previousItems) {
            delete previousItems[chatId];
        }
    }

    Object.keys(previousItems).forEach(key => previousItems[key].hide());

    return nextItems;
};

const ChatList = () => {
    const chatsContainer = createDiv(css.chatsContainer);
    const chatsWrapper = createDiv(css.chatsWrapper, chatsContainer);
    const rootNode = createDiv(css.root, chatsWrapper);
    const [destroy, callbacks] = destroyCallbacks(rootNode);
    let currentChatList = [];
    let previousItems = {};

    callbacks.push(destroyChatItems);

    callbacks.push(subscribeSelector(selectSortedChatList, (chatList) => {
        previousItems = renderList(chatList, chatsContainer, rootNode, previousItems);

        currentChatList = chatList;
    }));

    callbacks.push(onScroll(rootNode, throttle(() => {
        previousItems = renderList(currentChatList, chatsContainer, rootNode, previousItems);
    }, 100)));

    return {
        node: rootNode,
        destroy,
    };
};

export default ChatList;
