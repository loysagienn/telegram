import {createDiv, createText, createBr, destroyCallbacks, createImg} from 'ui';
import {STATIC_URL, DATABASE_PATH} from 'config';
import {select, subscribeSelector, dispatch} from 'client/store';
import {loadFile, updateFile} from 'actions';
import {
    selectCurrentUserId,
    selectFile,
} from 'selectors';
import css from './Message.styl';

const setImgSrc = (img, file, minithumbnail) => {
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

const renderImg = ({minithumbnail, sizes}, callbacks) => {
    const img = createImg(css.photoImg);

    const photo = selectPhotoFile(sizes);

    if (!select(selectFile(photo.id))) {
        dispatch(updateFile(photo));
    }

    callbacks.push(subscribeSelector(selectFile(photo.id), file => setImgSrc(img, file, minithumbnail)));

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

const renderTextMessage = ({text}) => {
    const node = createDiv(css.message);
    node.classList.add(css.text);

    renderText(node, text);

    return {node};
};

const renderPhotoMessage = ({content}, callbacks) => {
    const node = createDiv(css.message);
    node.classList.add(css.photo);

    const img = renderImg(content.photo, callbacks);

    node.appendChild(img);

    if (content.caption && content.caption.text) {
        img.classList.add(css.withText);

        node.appendChild(renderText(createDiv(css.photoText), content.caption.text));
    }


    // console.log(content);

    return {node};
};

const renderMessage = (message, callbacks) => {
    const {content} = message;

    if (content._ === 'messageText') {
        return renderTextMessage(content.text);
    }

    if (content._ === 'messagePhoto') {
        return renderPhotoMessage(message, callbacks);
    }

    const node = createDiv(css.message, createText(content._));
    node.classList.add(css.text);

    return {node};
};

const Message = (container, message, before) => {
    const callbacks = [];
    // console.log(message);
    const currentUser = select(selectCurrentUserId);
    const messageItem = renderMessage(message, callbacks);
    const node = createDiv(css.messageWrapper, messageItem.node);
    const [destroy] = destroyCallbacks(node, callbacks);

    node.classList.add(message.senderUserId === currentUser ? css.mine : css.foreign);

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
