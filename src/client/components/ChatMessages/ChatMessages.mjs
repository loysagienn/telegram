import {createDiv, createText, destroyCallbacks} from 'ui';
import css from './ChatMessages.styl';

const componentsItems = {};

const ChatMessages = (chatId, rootNode) => {
    if (chatId in componentsItems) {
        const item = componentsItems[chatId];

        item.show();

        return item;
    }

    const node = createDiv(css.root, createText(`chat ${chatId} messages`));
    const [destroy] = destroyCallbacks(node);

    rootNode.appendChild(node);

    const show = () => node.style.display = 'block';
    const hide = () => node.style.display = 'none';

    return componentsItems[chatId] = {
        node,
        destroy,
        show,
        hide,
    };
};


export default ChatMessages;
