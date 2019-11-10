import handlers from './handlers';


const handleMessage = (store, message, connection) => {
    const {type} = message;

    if (type && (type in handlers)) {
        handlers[type](store, message, connection)
            .then(result => console.log('airgram request success', result))
            .catch(error => console.log('airgram request error', error));
    }
};


export default handleMessage;
