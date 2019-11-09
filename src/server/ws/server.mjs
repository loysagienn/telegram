import WebSocket from 'ws';
import EventEmitter from 'events';

const server = new EventEmitter();

class Connection extends EventEmitter {
    constructor(wsConnection) {
        super();

        this.ws = wsConnection;
        this.terminated = false;
        this.terminateTimeout = null;

        // todo: memory leak, чистить за собой при закрытии соединения
        wsConnection.on('message', message => this.onMessage(message));
        wsConnection.send('pong');

        this.terminateOnInactive();
    }

    terminateOnInactive() {
        if (this.terminateTimeout) {
            clearTimeout(this.terminateTimeout);

            this.terminateTimeout = null;
        }

        if (this.terminated) {
            return;
        }

        this.terminateTimeout = setTimeout(() => {
            console.log(`terminate ws connection, user hash: ${this.userHash}`);

            this.terminated = true;

            this.emit('terminate');

            this.ws.terminate();
        }, 2 * 60 * 1000);
    }

    onMessage(messageStr) {
        this.terminateOnInactive();

        console.log(`ws message: ${messageStr}`);

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

            console.log(`create ws connection, user hash: ${message.userHash}`);

            server.emit('connection', this);

            return;
        }

        if (message.type === 'CLIENT_ERROR') {
            console.log('Client error:');
            console.log(message.error);

            return;
        }

        this.emit('message', message);
    }

    send(message) {
        this.ws.send(JSON.stringify(message));
    }
}

const onConnect = (wsConnection) => {
    new Connection(wsConnection);
};


// const wss = new ws.Server({noServer: true});
const wss = new WebSocket.Server({
    port: 8080,
});

wss.on('connection', onConnect);

module.exports = server;
