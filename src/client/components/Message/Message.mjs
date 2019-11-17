import {createDiv, createText, createBr, destroyCallbacks} from 'ui';
import {select} from 'client/store';
import {
    selectCurrentUserId,
} from 'selectors';
import css from './Message.styl';


const renderTextMessage = ({text}) => {
    const node = createDiv(css.content);

    const parts = text.split('\n');

    node.appendChild(createText(parts[0]));

    for (let i = 1; i < parts.length; i++) {
        node.appendChild(createBr());

        node.appendChild(createText(parts[i]));
    }

    return {node};
};

const renderMessage = (message) => {
    const {content} = message;

    if (content._ === 'messageText') {
        return renderTextMessage(content.text);
    }

    const node = createDiv(css.content, createText(content._));

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
