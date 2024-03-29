import {STATIC_URL, DATABASE_PATH} from 'config';
import {subscribeSelector, select, dispatch} from 'client/store';
import {getWhen, getColorByChatId} from 'utils';
import {
    selectChatType,
    selectChatPhotoFile,
    selectUserPhotoFile,
    selectChatMeta,
    selectChatStatus,
    selectChatOnlineStatus,
    selectChatLastMessage,
    selectChatName,
    selectChatIsActive,
} from 'selectors';
import {createDiv, createText, createSpan, destroyCallbacks, onClick} from 'ui';
import {loadFile, setActiveChat} from 'actions';
import css from './ChatList.styl';
import chatItems from './chatItems';
import {CHAT_HEIGHT} from './constants';


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

    callbacks.push(subscribeSelector(fileSelector, file => setAvatarImage(node, file, chatId)));
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
    }, true));

    return node;
};

const renderChatStatus = (chatId, blackText, blueText, redText, grayText, callbacks) => {
    callbacks.push(subscribeSelector(selectChatStatus(chatId), ({black, blue, red, gray}) => {
        blackText.textContent = black || '';
        blueText.textContent = blue || '';
        redText.textContent = red || '';
        grayText.textContent = gray || '';
    }));
};

const renderStatus = (chatId, callbacks) => {
    const blackText = createText();
    const blackNode = createSpan(css.statusBlack, blackText);
    const blueText = createText();
    const blueNode = createSpan(css.statusBlue, blueText);
    const redText = createText();
    const redNode = createSpan(css.statusRed, redText);
    const grayText = createText();
    const grayNode = createSpan(css.statusGray, grayText);
    const node = createDiv(css.status, blackNode, blueNode, redNode, grayNode);

    renderChatStatus(chatId, blackText, blueText, redText, grayText, callbacks);

    return node;
};

const renderUnreadCount = (chatId, callbacks) => {
    const unreadCountText = createText();
    const node = createDiv(css.unreadCount, unreadCountText);

    callbacks.push(subscribeSelector(selectChatMeta(chatId), ({unreadCount, isMute}) => {
        unreadCountText.textContent = unreadCount;

        if (unreadCount) {
            node.classList.add(css.visible);
        } else {
            node.classList.remove(css.visible);
        }

        if (isMute) {
            node.classList.add(css.isMute);
        } else {
            node.classList.remove(css.isMute);
        }
    }));

    return node;
};

const renderTime = (chatId, callbacks) => {
    const timeText = createText();
    const timeNode = createDiv(css.lastMessageTime, timeText);

    callbacks.push(subscribeSelector(selectChatLastMessage(chatId), (lastMessage) => {
        const {when} = getWhen(lastMessage.date);
        timeText.textContent = when;
    }, true));

    return timeNode;
};

const renderMeta = (chatId, callbacks) => {
    const unreadCountNode = renderUnreadCount(chatId, callbacks);
    const timeNode = renderTime(chatId, callbacks);
    const node = createDiv(css.meta, timeNode, unreadCountNode);

    return node;
};

const Chat = (chatId, chatsContainer) => {
    if (chatId in chatItems) {
        return chatItems[chatId];
    }

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

    callbacks.push(onClick(contentNode, () => dispatch(setActiveChat(chatId))));

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

    subscribeSelector(selectChatIsActive(chatId), (isActive) => {
        if (isActive) {
            contentNode.classList.add(css.isActive);
        } else {
            contentNode.classList.remove(css.isActive);
        }
    });

    return chatItems[chatId] = {
        node: rootNode,
        setOrder,
        destroy,
        hide,
        show,
    };
};

export default Chat;
