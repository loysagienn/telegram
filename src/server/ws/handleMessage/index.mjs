import handlers from './handlers';


const handleMessage = (store, message) => {
    const {type} = message;

    if (type && (type in handlers)) {
        handlers[type](store, message);
    }
};


export default handleMessage;
