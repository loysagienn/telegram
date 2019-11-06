import WebSocket from 'ws';
import EventEmitter from 'events';

const server = new EventEmitter();

class Connection extends EventEmitter {
    constructor(wsConnection) {
        super();

        this.ws = wsConnection;

        // todo: memory leak, чистить за собой при закрытии соединения
        wsConnection.on('message', message => this.onMessage(message));
    }

    onMessage(messageStr) {
        if (messageStr === 'ping') {
            this.ws.send('pong');

            return;
        }

        let message;

        try {
            message = JSON.parse(messageStr);
        } catch (error) {
            console.log('message json parse error', error);

            return;
        }

        if (message.type === 'INIT_USER') {
            this.userHash = message.userHash;

            server.emit('connection', this);

            return;
        }

        this.emit('message', message);
    }

    send(message) {
        this.ws.send(JSON.stringify(message));
    }
}

const onConnect = (wsConnection) => {
    console.log('on connect');
    new Connection(wsConnection);
};


// const wss = new ws.Server({noServer: true});
const wss = new WebSocket.Server({
    port: 8080,
});

wss.on('connection', onConnect);

module.exports = server;
