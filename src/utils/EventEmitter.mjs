class EventEmitter {
    constructor() {
        this._eventHanders = {};
    }

    on(event, callback) {
        if (!this._eventHanders[event]) {
            this._eventHanders[event] = [];
        }

        this._eventHanders[event].push(callback);

        return () => this.off(event, callback);
    }

    off(event, callback) {
        if (!this._eventHanders[event]) {
            return;
        }

        const index = this._eventHanders[event].indexOf(callback);

        if (index !== -1) {
            this._eventHanders[event].spice(index, 1);
        }
    }

    emit(event, ...args) {
        if (!this._eventHanders[event]) {
            return;
        }

        this._eventHanders[event].forEach(callback => callback(...args));
    }
}

export default EventEmitter;
