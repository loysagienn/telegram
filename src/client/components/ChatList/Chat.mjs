import {STATIC_URL, DATABASE_PATH} from 'config';
import {subscribeSelector, select, dispatch} from 'client/store';
import {
    selectChatLastMessage,
    selectChat,
    selectChatType,
    selectUser,
    selectUserStatus,
    selectChatPhotoFile,
    selectUserPhotoFile,
    selectChatReadStatus,
} from 'selectors';
import {createDiv, createText, createSpan, destroyCallbacks} from 'ui';
import {getWhen} from 'utils';
import {loadFile} from 'actions';
import css from './ChatList.styl';
import chatItems from './chatItems';
import {CHAT_HEIGHT} from './constants';


const setAvatarImage = (node, file) => {
    if (!file) {
        return;
    }

    const {path, isDownloadingActive, isDownloadingCompleted} = file.local;

    if (!path) {
        if (!isDownloadingActive && !isDownloadingCompleted) {
            dispatch(loadFile(file.id));
        }

        return;
    }

    const relativePath = path.replace(DATABASE_PATH, '');

    node.style.backgroundImage = `url('${STATIC_URL}${relativePath}')`;
};

const renderAvatar = (chatId, callbacks) => {
    const node = createDiv(css.avatar);

    const type = select(selectChatType(chatId));
    const fileSelector = type._ === 'chatTypePrivate' ? selectUserPhotoFile(type.userId) : selectChatPhotoFile(chatId);

    callbacks.push(subscribeSelector(fileSelector, file => setAvatarImage(node, file)), true);

    return node;
};

const renderName = (chatId, callbacks) => {
    const text = createText();
    const node = createDiv(css.name, text);

    callbacks.push(subscribeSelector(selectChat(chatId), chat => text.textContent = chat.title), true);

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
    }), true);
};

const getChatStatus = (content) => {
    if (content._ === 'messageText') {
        return content.text.text.substring(0, 50);
    }

    if (content._ === 'messagePhoto') {
        if (content.caption) {
            return `\\u{1f5bc} ${content.caption.text.substring(0, 50)}`;
        }

        return '\\u{1f5bc}';
    }

    if (content._ === 'messageVideo') {
        if (content.caption) {
            return `\\u{1f4f9} ${content.caption.text.substring(0, 50)}`;
        }

        return '\\u{1f4f9}';
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

const renderUnreadCount = (chatId, callbacks) => {
    const unreadCountText = createText();
    const node = createDiv(css.unreadCount, unreadCountText);

    callbacks.push(subscribeSelector(selectChatReadStatus(chatId), (readStatus) => {
        if (!readStatus) {
            return;
        }

        const {unreadCount} = readStatus;

        unreadCountText.textContent = unreadCount;

        if (unreadCount) {
            node.classList.add(css.visible);
        } else {
            node.classList.remove(css.visible);
        }
    }));

    return node;
};

const renderMeta = (chatId, callbacks) => {
    const unreadCountNode = renderUnreadCount(chatId, callbacks);
    const node = createDiv(css.meta, unreadCountNode);

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
    const metaNode = renderMeta(chatId, callbacks);

    const contentNode = createDiv(css.chat, avatarNode, descNode, metaNode);
    const rootNode = createDiv(css.chatWrapper, contentNode);
    const [destroy] = destroyCallbacks(rootNode, callbacks);


    callbacks.push(() => { delete chatItems[chatId]; });

    const setOrder = index => rootNode.style.transform = `translate(0, ${index * CHAT_HEIGHT}px)`;

    return chatItems[chatId] = {
        node: rootNode,
        setOrder,
        destroy,
    };
};

export default Chat;
