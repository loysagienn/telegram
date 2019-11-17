import {createDiv, createText, onClick, destroyCallbacks, createSpan} from 'ui';
import {STATIC_URL, DATABASE_PATH} from 'config';
import {setActiveChat, loadFile} from 'actions';
import {subscribeSelector, select, dispatch} from 'client/store';
import {getColorByChatId} from 'utils';
import {
    selectChatType,
    selectChatPhotoFile,
    selectUserPhotoFile,
    selectChatName,
    selectChatHeaderStatus,
} from 'selectors';

import css from './ChatMessages.styl';


const backBtnSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <g fill="none" fill-rule="evenodd">
    <polygon points="0 0 24 0 24 24 0 24"/>
    <path fill="#404040" fill-rule="nonzero" d="M4.29289322,11.2928932 L11.2928932,4.29289322 C11.6834175,3.90236893 12.3165825,3.90236893 12.7071068,4.29289322 C13.0675907,4.65337718 13.0953203,5.22060824 12.7902954,5.61289944 L12.7071068,5.70710678 L7.414,11 L19,11 C19.5128358,11 19.9355072,11.3860402 19.9932723,11.8833789 L20,12 C20,12.5128358 19.6139598,12.9355072 19.1166211,12.9932723 L19,13 L7.414,13 L12.7071068,18.2928932 C13.0675907,18.6533772 13.0953203,19.2206082 12.7902954,19.6128994 L12.7071068,19.7071068 C12.3466228,20.0675907 11.7793918,20.0953203 11.3871006,19.7902954 L11.2928932,19.7071068 L4.29289322,12.7071068 C3.93240926,12.3466228 3.90467972,11.7793918 4.20970461,11.3871006 L4.29289322,11.2928932 L11.2928932,4.29289322 L4.29289322,11.2928932 Z"/>
  </g>
</svg>`;

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

const renderBackBtn = () => {
    const backBtn = createDiv(css.backBtn);

    backBtn.innerHTML = backBtnSvg;

    onClick(backBtn, () => dispatch(setActiveChat(null)));

    return backBtn;
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

const Header = (chatId, rootNode) => {
    const callbacks = [];
    const avatarNode = renderAvatar(chatId, callbacks);
    const nameNode = renderName(chatId, callbacks);
    const statusNode = renderStatus(chatId, callbacks);
    const backBtnNode = renderBackBtn();
    const chatInfoNode = createDiv(css.chatInfo, avatarNode, nameNode, statusNode);
    const node = createDiv(css.header, chatInfoNode, backBtnNode);
    const [destroy] = destroyCallbacks(node, callbacks);

    rootNode.appendChild(node);

    return {
        node,
        destroy,
    };
};

export default Header;
