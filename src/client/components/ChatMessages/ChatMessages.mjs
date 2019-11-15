import {createDiv, createText, destroyCallbacks} from 'ui';
import css from './ChatMessages.styl';
import Header from './Header';


const ChatMessages = (chatId, rootNode, chatsItems) => {
    if (chatId in chatsItems) {
        const item = chatsItems[chatId];

        item.show();

        return item;
    }

    const header = Header(chatId);
    const node = createDiv(css.root, header.node);
    const [destroy] = destroyCallbacks(node);

    rootNode.appendChild(node);

    const show = () => node.style.display = 'block';
    const hide = () => node.style.display = 'none';

    return chatsItems[chatId] = {
        node,
        destroy,
        show,
        hide,
    };
};


export default ChatMessages;
