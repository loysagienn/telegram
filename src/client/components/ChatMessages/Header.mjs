import {createDiv, createText, destroyCallbacks, createSpan} from 'ui';
import {STATIC_URL, DATABASE_PATH} from 'config';
import {subscribeSelector, select, dispatch} from 'client/store';
import {getColorByChatId} from 'utils';
import {
    selectChatType,
    selectChatPhotoFile,
    selectUserPhotoFile,
    selectChatName,
    selectChatHeaderStatus,
} from 'selectors';
import {loadFile} from 'actions';
import css from './ChatMessages.styl';


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
    const node = createDiv(css.avatar);

    const type = select(selectChatType(chatId));
    const fileSelector = type._ === 'chatTypePrivate' ? selectUserPhotoFile(type.userId) : selectChatPhotoFile(chatId);

    callbacks.push(subscribeSelector(fileSelector, file => setAvatarImage(node, file, chatId)));

    return node;
};

const renderName = (chatId, callbacks) => {
    const text = createText();
    const node = createDiv(css.chatName, text);

    callbacks.push(subscribeSelector(selectChatName(chatId), (name) => {
        text.textContent = name;
    }, true));

    return node;
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
    const node = createDiv(css.chatStatus, blackNode, blueNode, redNode, grayNode);

    callbacks.push(subscribeSelector(selectChatHeaderStatus(chatId), ({black, blue, red, gray}) => {
        blackText.textContent = black || '';
        blueText.textContent = blue || '';
        redText.textContent = red || '';
        grayText.textContent = gray || '';
    }));

    return node;
};

const Header = (chatId) => {
    const callbacks = [];
    const avatarNode = renderAvatar(chatId, callbacks);
    const nameNode = renderName(chatId, callbacks);
    const statusNode = renderStatus(chatId, callbacks);
    const node = createDiv(css.header, avatarNode, nameNode, statusNode);
    const [destroy] = destroyCallbacks(node, callbacks);

    return {
        node,
        destroy,
    };
};

export default Header;
