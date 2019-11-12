import {STATIC_URL, DATABASE_PATH} from 'config';
import {subscribeSelector, select, dispatch} from 'client/store';
import {
    selectChat,
    selectChatType,
    selectChatPhotoFile,
    selectUserPhotoFile,
    selectChatReadStatus,
    selectChatStatus,
    selectChatOnlineStatus,
    selectChatName,
} from 'selectors';
import {createDiv, createText, createSpan, destroyCallbacks} from 'ui';
import {loadFile} from 'actions';
import css from './ChatList.styl';
import chatItems from './chatItems';
import {CHAT_HEIGHT} from './constants';

const chatBgColors = [
    '#FFCDD2',
    '#E1BEE7',
    '#C5CAE9',
    '#B3E5FC',
    '#B2DFDB',
    '#DCEDC8',
    '#FFF9C4',
    '#FFE0B2',
    '#FFCCBC',
    '#D7CCC8',
];

const getColorByChatId = (chatId) => {
    const part = Math.round(chatId / 37);
    const num = part - (Math.floor(part / 10) * 10);

    return chatBgColors[num];
};

const setAvatarImage = (node, file, chatId) => {
    if (!file) {
        node.style.backgroundColor = getColorByChatId(chatId);
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
    const onlineStatusInner = createDiv(css.onlineStatusInner);
    const onlineStatus = createDiv(css.onlineStatus, onlineStatusInner);
    const node = createDiv(css.avatar, onlineStatus);

    const type = select(selectChatType(chatId));
    const fileSelector = type._ === 'chatTypePrivate' ? selectUserPhotoFile(type.userId) : selectChatPhotoFile(chatId);

    callbacks.push(subscribeSelector(fileSelector, file => setAvatarImage(node, file, chatId)), true);
    callbacks.push(subscribeSelector(selectChatOnlineStatus(chatId), (isOnline) => {
        if (isOnline) {
            onlineStatus.classList.add(css.visible);
        } else {
            onlineStatus.classList.remove(css.visible);
        }
    }));

    return node;
};

const renderName = (chatId, callbacks) => {
    const text = createText();
    const node = createDiv(css.name, text);

    callbacks.push(subscribeSelector(selectChatName(chatId), (name) => {
        text.textContent = name;
    }), true);

    return node;
};

const renderChatStatus = (chatId, blackText, blueText, grayText, callbacks) => {
    callbacks.push(subscribeSelector(selectChatStatus(chatId), ({black, blue, gray}) => {
        blackText.textContent = black || '';
        blueText.textContent = blue || '';
        grayText.textContent = gray || '';
    }));
};

const renderStatus = (chatId, callbacks) => {
    const blackText = createText();
    const blackNode = createSpan(css.statusBlack, blackText);
    const blueText = createText();
    const blueNode = createSpan(css.statusBlue, blueText);
    const grayText = createText();
    const grayNode = createSpan(css.statusGray, grayText);
    const node = createDiv(css.status, blackNode, blueNode, grayNode);

    renderChatStatus(chatId, blackText, blueText, grayText, callbacks);

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

const Chat = (chatId, chatsContainer) => {
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

    chatsContainer.appendChild(rootNode);

    callbacks.push(() => { delete chatItems[chatId]; });

    let currentOrderIndex = null;
    let isVisible = true;

    const hide = () => {
        if (!isVisible) {
            return;
        }

        isVisible = false;
        rootNode.style.display = 'none';
    };
    const show = () => {
        if (isVisible) {
            return;
        }

        isVisible = true;
        rootNode.style.display = 'block';
    };

    const setOrder = (index) => {
        show();

        if (index === currentOrderIndex) {
            return;
        }

        currentOrderIndex = index;

        rootNode.style.transform = `translate(0, ${index * CHAT_HEIGHT}px)`;
    };

    return chatItems[chatId] = {
        node: rootNode,
        setOrder,
        destroy,
        hide,
        show,
    };
};

export default Chat;
