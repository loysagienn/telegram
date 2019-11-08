import {EventEmitter} from 'utils';
import {WEB_SOCKET_URL} from 'config';
import getUserHash from './getUserHash';

const userHash = getUserHash();

let createWs = () => {
    console.log('create ws');
    const ws = window.preCreatedWs || new WebSocket(WEB_SOCKET_URL);

    createWs = () => new WebSocket(WEB_SOCKET_URL);

    return ws;
};

class Ws extends EventEmitter {
    constructor() {
        super();

        this.activeWs = null;
        this.queue = [];
        this.errorsCount = 0;

        this.createConnection();
        this.startPing();
    }

    startPing() {
        setInterval(() => {
            if (!this.activeWs) {
                return;
            }

            this.activeWs.send('ping');
        }, 20000);
    }

    send(request) {
        if (this.activeWs) {
            this.activeWs.send(JSON.stringify(request));
        } else {
            this.queue.push(request);
        }
    }

    onMessage(event) {
        if (event.data === 'pong') {
            return;
        }

        let message;

        try {
            message = JSON.parse(event.data);
        } catch (error) {
            console.log('json parse message error', error);
            console.log('message data:', event.data);
            console.log('');

            return;
        }

        console.log('message', message);

        this.emit('message', message);
    }

    createConnection() {
        console.log('start ws connection');
        const ws = createWs();

        ws.addEventListener('open', () => {
            console.log('ws open');
            this.activeWs = ws;
            const {queue} = this;
            this.queue = [];
            this.errorsCount = 0;

            queue.forEach(item => this.send(item));
            this.send({type: 'INIT_USER', userHash});
        });


        ws.onmessage = event => this.onMessage(event);

        ws.onclose = event => this.destroyConnection(event);
        ws.onerror = event => console.log('ws error', event);
    }

    destroyConnection(event) {
        this.errorsCount++;
        console.log('destroy ws connection', event);

        this.activeWs = null;

        if (this.errorsCount < 3) {
            this.createConnection();
        } else {
            setTimeout(() => this.createConnection(), Math.min(this.errorsCount * 1000, 20000));
        }
    }
}


export default Ws;
