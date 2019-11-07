import {subscribeSelector, select} from 'client/store';
import {selectChatList, selectChat} from 'selectors';
import {createDiv, createText, destroyCallbacks} from 'ui';
import css from './ChatList.styl';
import chatItems from './chatItems';


const renderAvatar = () => {
    const node = createDiv(css.avatar);

    return node;
};

const renderName = (chatId, callbacks) => {
    const text = createText();
    const node = createDiv(css.name, text);

    callbacks.push(subscribeSelector(selectChat(chatId), chat => text.textContent = chat.title));

    return node;
};

const renderStatus = (chatId, callbacks) => {
    const text = createText('Status');
    const node = createDiv(css.status, text);

    return node;
};

const renderMeta = () => {
    const node = createDiv(css.meta);

    return node;
};

const Chat = (chatId) => {
    if (chatId in chatItems) {
        return chatItems[chatId];
    }

    console.log(select(selectChat(chatId)));

    const callbacks = [];
    const avatarNode = renderAvatar();
    const nameNode = renderName(chatId, callbacks);
    const statusNode = renderStatus(chatId, callbacks);
    const descNode = createDiv(css.desc, nameNode, statusNode);
    const metaNode = renderMeta();

    const contentNode = createDiv(css.chat, avatarNode, descNode, metaNode);
    const rootNode = createDiv(css.chatWrapper, contentNode);
    const [destroy] = destroyCallbacks(rootNode, callbacks);


    callbacks.push(() => { delete chatItems[chatId]; });

    return chatItems[chatId] = {
        node: rootNode,
        destroy,
    };
};

export default Chat;
