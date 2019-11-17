import {createDiv, createText, createBr, destroyCallbacks, createImg, createLink} from 'ui';
import {STATIC_URL, DATABASE_PATH} from 'config';
import {getColorByChatId} from 'utils';
import {select, subscribeSelector, dispatch} from 'client/store';
import {loadFile, updateFile, getUser} from 'actions';
import {
    selectCurrentUserId,
    selectFile,
    selectUserPhotoFile,
    selectUser,
} from 'selectors';
import css from './Message.styl';


const setAvatarImage = (node, file, userId) => {
    if (!file) {
        node.style.backgroundColor = getColorByChatId(userId);

        dispatch(getUser(userId));

        return;
    }

    const {path, isDownloadingActive, isDownloadingCompleted} = file.local;

    if (!path) {
        if (!isDownloadingActive && !isDownloadingCompleted) {
            dispatch(loadFile(file.id));
        }

        return;
    }

    if (isDownloadingCompleted) {
        const relativePath = path.replace(DATABASE_PATH, '');

        node.style.backgroundImage = `url('${STATIC_URL}${relativePath}')`;
    }
};

const getTgs = path => `<tgs-player
    class="${css.stickerImage}"
    autoplay
    loop
    mode="normal"
    src="${STATIC_URL}${path}"
>
</tgs-player>`;

const getImg = path => `<img class="${css.stickerImage}" src="${STATIC_URL}${path}"></img>`;

const setStickerImage = (node, {emoji}, file) => {
    if (!file) {
        return;
    }

    const {path, isDownloadingActive, isDownloadingCompleted} = file.local;

    if (!path) {
        if (!isDownloadingActive && !isDownloadingCompleted) {
            dispatch(loadFile(file.id));
        }
    }

    if (path && isDownloadingCompleted) {
        const relativePath = path.replace(DATABASE_PATH, '');
        if (relativePath.indexOf('.tgs') !== -1) {
            node.innerHTML = getTgs(relativePath);
        } else {
            node.innerHTML = getImg(relativePath);
        }
    } else if (emoji) {
        node.innerHTML = `<div class="${css.stickerEmoji}">${emoji}</div>`;
    }
};

const renderAvatar = (message, callbacks) => {
    const node = createDiv(css.avatar);

    callbacks.push(subscribeSelector(selectUserPhotoFile(message.senderUserId), (file) => {
        setAvatarImage(node, file, message.senderUserId);
    }));

    return {node};
};

const setImgSrc = (img, file, minithumbnail, messageNode) => {
    if (!file) {
        if (minithumbnail) {
            img.src = `data:image/jpeg;base64,${minithumbnail.data}`;
        }

        dispatch(loadFile(file.id));

        return;
    }

    const {path, isDownloadingActive, isDownloadingCompleted} = file.local;

    if (!path) {
        if (!isDownloadingActive && !isDownloadingCompleted) {
            dispatch(loadFile(file.id));
        }
    }

    if (path && isDownloadingCompleted) {
        const relativePath = path.replace(DATABASE_PATH, '');

        img.src = `${STATIC_URL}${relativePath}`;
    } else if (minithumbnail) {
        img.src = `data:image/jpeg;base64,${minithumbnail.data}`;
    }

    if (img.width && img.height && img.height / img.width > 1.4) {
        messageNode.classList.add(css.isVertical);
    }
};

const selectPhotoFile = (sizes) => {
    for (let i = 0; i < sizes.length; i++) {
        const item = sizes[i];

        if (item.width > 500) {
            return item.photo;
        }
    }

    return sizes[sizes.length - 1].photo;
};

const renderImg = ({minithumbnail, sizes}, callbacks, messageNode) => {
    const img = createImg(css.photoImg);

    const photo = selectPhotoFile(sizes);

    if (!select(selectFile(photo.id))) {
        dispatch(updateFile(photo));
    }

    callbacks.push(subscribeSelector(selectFile(photo.id), file => setImgSrc(img, file, minithumbnail, messageNode)));

    return img;
};

const renderPhotoMessage = ({content}, callbacks) => {
    const node = createDiv(css.message);
    node.classList.add(css.photo);

    const img = renderImg(content.photo, callbacks, node);

    node.appendChild(img);

    if (content.caption && content.caption.text) {
        img.classList.add(css.withText);

        node.appendChild(renderText(createDiv(css.photoText), content.caption.text));
    }

    return {node};
};

const renderAnimation = ({minithumbnail, thumbnail}, callbacks, messageNode) => {
    const img = createImg(css.photoImg);

    const {photo} = thumbnail;

    if (!select(selectFile(photo.id))) {
        dispatch(updateFile(photo));
    }

    callbacks.push(subscribeSelector(selectFile(photo.id), file => setImgSrc(img, file, minithumbnail, messageNode)));

    return img;
};

const renderText = (node, text) => {
    const parts = text.split('\n');

    node.appendChild(createText(parts[0]));

    for (let i = 1; i < parts.length; i++) {
        node.appendChild(createBr());

        node.appendChild(createText(parts[i]));
    }

    return node;
};

const renderName = (userId, callbacks) => {
    const text = createText();
    const node = createDiv(css.userName, text);

    callbacks.push(subscribeSelector(selectUser(userId), (user) => {
        if (!user) {
            dispatch(getUser(userId));

            return;
        }

        text.textContent = user.firstName;
    }));

    return {node};
};

const renderTextMessage = ({text}, webPage, {senderUserId}, callbacks, needName) => {
    const textContent = createDiv(css.text);
    const node = createDiv(css.message, textContent);
    node.classList.add(css.textMessage);

    if (needName) {
        const name = renderName(senderUserId, callbacks);

        textContent.appendChild(name.node);
    }

    renderText(textContent, text);

    if (webPage && webPage.photo) {
        const img = renderImg(webPage.photo, callbacks, node);

        const link = createLink(css.webPageLink);
        link.target = '_blank';
        link.href = webPage.url;

        link.appendChild(img);

        node.appendChild(link);
    }

    return {node};
};

const renderAnimationMessage = ({content}, callbacks) => {
    const node = createDiv(css.message);
    node.classList.add(css.photo);

    const img = renderAnimation(content.animation, callbacks, node);

    node.appendChild(img);

    if (content.caption && content.caption.text) {
        img.classList.add(css.withText);

        node.appendChild(renderText(createDiv(css.photoText), content.caption.text));
    }

    return {node};
};

const renderStickerMessage = (content, callbacks) => {
    const placeholder = createDiv(css.stickerPlaceholder);
    const stickerContent = createDiv(css.stickerContent);
    const node = createDiv(css.sticker, placeholder, stickerContent);

    const {sticker} = content;

    if (!select(selectFile(sticker.sticker.id))) {
        dispatch(updateFile(sticker.sticker));
    }

    callbacks.push(subscribeSelector(
        selectFile(sticker.sticker.id),
        file => setStickerImage(stickerContent, sticker, file),
    ));

    return {node};
};

const renderJoinByLinkMessage = (message, callbacks) => {
    const text = createText('joined by invite link');
    const node = createDiv(css.message, text);
    node.classList.add(css.text);

    const {senderUserId} = message;

    callbacks.push(subscribeSelector(selectUser(senderUserId), (user) => {
        if (!user) {
            dispatch(getUser(senderUserId));

            return;
        }

        text.textContent = `${user.firstName} joined by invite link`;
    }));

    return {node};
};

const renderMessage = (message, callbacks, needName) => {
    const {content} = message;

    if (content._ === 'messageText') {
        return renderTextMessage(content.text, content.webPage, message, callbacks, needName);
    }

    if (content._ === 'messagePhoto') {
        return renderPhotoMessage(message, callbacks);
    }

    if (content._ === 'messageSticker') {
        return renderStickerMessage(content, callbacks);
    }

    if (content._ === 'messageAnimation') {
        return renderAnimationMessage(message, callbacks);
    }

    if (content._ === 'messageChatJoinByLink') {
        return renderJoinByLinkMessage(message, callbacks);
    }

    const node = createDiv(css.message, createText(content._));
    node.classList.add(css.text);

    return {node};
};

const Message = (container, message, needRenderAvatar, before) => {
    const callbacks = [];
    const currentUser = select(selectCurrentUserId);
    const node = createDiv(css.messageWrapper);
    const [destroy] = destroyCallbacks(node, callbacks);

    node.classList.add(message.senderUserId === currentUser ? css.mine : css.foreign);

    if (needRenderAvatar && message.senderUserId !== currentUser) {
        const avatar = renderAvatar(message, callbacks);

        node.appendChild(avatar.node);
    }

    const messageItem = renderMessage(message, callbacks, needRenderAvatar && message.senderUserId !== currentUser);

    node.appendChild(messageItem.node);

    if (before) {
        container.insertBefore(node, before.node);
    } else {
        container.appendChild(node);
    }

    return {
        node,
        destroy,
        message,
    };
};


export default Message;
