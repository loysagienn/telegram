import {createDiv, createText, destroyCallbacks} from 'ui';
import MessagesList from '../MessagesList';
import css from './ChatMessages.styl';
import Header from './Header';


const ChatMessages = (chatId, rootNode) => {
    const callbacks = [];
    const node = createDiv(css.root);
    const [destroy] = destroyCallbacks(node, callbacks);

    rootNode.appendChild(node);

    const header = Header(chatId, node);
    const messagesList = MessagesList(chatId, node);

    callbacks.push(() => header.destroy());
    callbacks.push(() => messagesList.destroy());

    return {
        node,
        destroy,
    };
};


export default ChatMessages;
