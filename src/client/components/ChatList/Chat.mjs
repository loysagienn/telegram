import {subscribeSelector, select, dispatch} from 'client/store';
import {
    selectChatLastMessage,
    selectChat,
    selectChatType,
    selectUser,
    selectUserStatus,
    selectChatPhotoFile,
    selectUserPhotoFile,
} from 'selectors';
import {createDiv, createText, createSpan, destroyCallbacks} from 'ui';
import {getWhen} from 'utils';
import {loadFile} from 'actions';
import css from './ChatList.styl';
import chatItems from './chatItems';


const setAvatarImage = (node, file) => {
    if (!file) {
        return;
    }

    if (!file.local.path) {
        if (!file.local.isDownloadingActive) {
            dispatch(loadFile(file.id));
        }

        return;
    }

    console.log('render file! ', file.local.path);
};

const renderAvatar = (chatId, callbacks) => {
    const node = createDiv(css.avatar);

    const type = select(selectChatType(chatId));
    const fileSelector = type._ === 'chatTypePrivate' ? selectUserPhotoFile(type.userId) : selectChatPhotoFile(chatId);

    callbacks.push(subscribeSelector(fileSelector, file => setAvatarImage(node, file)));

    return node;
};

const renderName = (chatId, callbacks) => {
    const text = createText();
    const node = createDiv(css.name, text);

    callbacks.push(subscribeSelector(selectChat(chatId), chat => text.textContent = chat.title));

    return node;
};

const getUserStatus = (status) => {
    if (status._ === 'userStatusOnline') {
        return 'Online';
    }

    if (status._ === 'userStatusOffline') {
        return `Was online at ${getWhen(status.wasOnline)}`;
    }

    if (status._ === 'userStatusRecently') {
        return 'Was online recently';
    }

    if (status._ === 'userStatusLastWeek') {
        return 'Was online last week';
    }

    if (status._ === 'userStatusLastMonth') {
        return 'Was online last month';
    }

    return '';
};

const renderUserStatus = (userId, text, node, callbacks) => {
    callbacks.push(subscribeSelector(selectUserStatus(userId), (status) => {
        if (status._ === 'userStatusOnline') {
            node.classList.add(css.online);
        } else {
            node.classList.remove(css.online);
        }

        text.textContent = getUserStatus(status);
    }));
};

const getChatStatus = (content) => {
    if (content._ === 'messageText') {
        return content.text.text.substring(0, 50);
    }

    if (content._ === 'messagePhoto') {
        if (content.caption) {
            return `🖼 ${content.caption.text.substring(0, 50)}`;
        }

        return '🖼';
    }

    if (content._ === 'messageVideo') {
        if (content.caption) {
            return `📹 ${content.caption.text.substring(0, 50)}`;
        }

        return '📹';
    }

    return content._;
};

const renderChatStatus = (chatId, text, prefixText, callbacks) => {
    callbacks.push(subscribeSelector(selectChatLastMessage(chatId), (message) => {
        if (!message) {
            text.textContent = '';

            return;
        }

        let prefix = '';

        if (message.senderUserId) {
            const user = select(selectUser(message.senderUserId));

            if (user && user.firstName) {
                prefix = `${user.firstName}: `;
            }
        }

        prefixText.textContent = prefix;
        text.textContent = getChatStatus(message.content);
    }));
};

const renderStatus = (chatId, callbacks) => {
    const prefixText = createText();
    const prefixNode = createSpan(css.statusPrefix, prefixText);
    const text = createText();
    const node = createDiv(css.status, prefixNode, text);

    const type = select(selectChatType(chatId));

    if (type._ === 'chatTypePrivate') {
        renderUserStatus(type.userId, text, node, callbacks);
    } else {
        renderChatStatus(chatId, text, prefixText, callbacks);
    }

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

    // console.log(select(selectChat(chatId)));
    const callbacks = [];
    const avatarNode = renderAvatar(chatId, callbacks);
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
