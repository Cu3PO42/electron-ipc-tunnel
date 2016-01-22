"use strict";
var electron_1 = require("electron");
var clients = {};
class IpcClient {
    constructor() {
        this.eventCount = 0;
        this.handle = electron_1.ipcRenderer.sendSync("paired-request-handle");
        clients[this.handle] = this;
    }
    send(message, ...args) {
        var id = this.eventCount++;
        electron_1.ipcRenderer.send("paired-message", { handle: this.handle, id: id, message: message, args: args });
        return new Promise((resolve, reject) => {
            this.curPromises[id] = { resolve: resolve, reject: reject };
        });
    }
    resolve(id, err, res) {
        if (err !== null) {
            this.curPromises[id].resolve(res);
        }
        else {
            this.curPromises[id].reject(err);
        }
        delete this.curPromises[id];
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IpcClient;
electron_1.ipcRenderer.on("paired-reply", function (e, res) {
    clients[res.handle].resolve(res.id, res.err, res.res);
});
