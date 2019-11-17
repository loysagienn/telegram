import {createDiv, createText, createBr, destroyCallbacks, createImg} from 'ui';
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

const renderTextMessage = ({text}, {senderUserId}, callbacks, needName) => {
    const node = createDiv(css.message);
    node.classList.add(css.text);

    if (needName) {
        const name = renderName(senderUserId, callbacks);

        node.appendChild(name.node);
    }

    renderText(node, text);

    return {node};
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


    // console.log(content);

    return {node};
};

const renderMessage = (message, callbacks, needName) => {
    const {content} = message;

    if (content._ === 'messageText') {
        return renderTextMessage(content.text, message, callbacks, needName);
    }

    if (content._ === 'messagePhoto') {
        return renderPhotoMessage(message, callbacks);
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
