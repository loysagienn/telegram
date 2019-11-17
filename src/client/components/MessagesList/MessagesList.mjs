/* eslint-disable no-continue */
import {createDiv, destroyCallbacks, onScroll} from 'ui';
import {subscribeSelector, dispatch, select} from 'client/store';
import {throttle} from 'utils';
import {
    selectChatMessages,
    selectCurrentUserId,
    selectChat,
} from 'selectors';
import {getChatMessages, viewMessages} from 'actions';
import Message from '../Message';
import css from './MessagesList.styl';


const setViewMessages = (chatId, messages, options) => {
    if (!messages.length) {
        return;
    }

    const currentUserId = select(selectCurrentUserId);

    if (!currentUserId) {
        return;
    }

    let index = 0;
    const max = Math.min(messages.length - 1, 20);

    while (index < max && messages[index].senderUserId === currentUserId) {
        index++;
    }

    const message = messages[index];

    if (message.senderUserId !== currentUserId) {
        dispatch(viewMessages(chatId, [message.id]));

        options.setViewMessages = true;

        return;
    }

    if (index > 15) {
        options.setViewMessages = true;
    }
};

const loadMessages = (chatId, messages, {fromMessagesIds}) => {
    let fromMessageId = 0;
    const offset = 0;

    if (messages && messages.length) {
        fromMessageId = messages[messages.length - 1].id;
    }

    if (fromMessagesIds[chatId] && fromMessagesIds[chatId] === fromMessageId) {
        return;
    }

    fromMessagesIds[chatId] = fromMessageId;

    dispatch(getChatMessages(chatId, fromMessageId, offset));
};


const onListScroll = throttle((node, chatId, messages, options) => {
    if (node.scrollTop < 1000) {
        loadMessages(chatId, messages, options);
    }
}, 100);

const renderList = (chatId, container, messages, activeMessages, node, options) => {
    if (messages.length < 10) {
        loadMessages(chatId, messages, options);
    }

    const chat = select(selectChat(chatId));
    const needRenderAvatar = chat.type._ !== 'chatTypePrivate' && !chat.type.isChannel;

    const bottomSpace = (node.scrollHeight - node.offsetHeight - node.scrollTop);

    let index = 0;
    let addMessagesBefore = 0;

    while (index < messages.length) {
        const message = messages[index];

        if (activeMessages.length <= index) {
            activeMessages.push(Message(container, message, needRenderAvatar));
            index++;

            continue;
        }

        const item = activeMessages[index];

        if (item.message === message) {
            index++;

            continue;
        }

        if (item.message.id > message.id) {
            item.destroy();

            activeMessages.splice(index, 1);

            continue;
        }

        addMessagesBefore++;
        options.setViewMessages = false;

        activeMessages.splice(index, 0, Message(container, message, needRenderAvatar, item));

        index++;
    }

    while (index < activeMessages.length) {
        activeMessages.pop().destroy();
    }

    if (!(bottomSpace > 5 || addMessagesBefore > 1)) {
        const scrollTop = Math.max(node.scrollHeight - node.offsetHeight - bottomSpace, 5);

        node.scrollTop = scrollTop;
    }

    if (!options.setViewMessages) {
        setViewMessages(chatId, messages, options);
    }

    onListScroll(node, chatId, messages, options);
};

const MessagesList = (chatId, rootNode) => {
    const callbacks = [];
    const listWrapper = createDiv(css.listWrapper);
    const node = createDiv(css.root, listWrapper);
    const [destroy] = destroyCallbacks(node, callbacks);
    const activeMessages = [];
    const options = {fromMessagesIds: {}};
    let currentMessages = [];

    rootNode.appendChild(node);

    callbacks.push(subscribeSelector(
        selectChatMessages(chatId), (messages) => {
            currentMessages = messages;

            renderList(chatId, listWrapper, messages, activeMessages, node, options);
        },
    ));

    callbacks.push(onScroll(node, () => onListScroll(node, chatId, currentMessages, options)));

    return {
        node,
        destroy,
    };
};


export default MessagesList;
