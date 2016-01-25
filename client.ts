/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/github-electron/github-electron.d.ts" />

import { ipcRenderer as ipc } from "electron";
import { EventEmitter } from "events";

var clients: { [handle: string]: IpcClient; } = {};

export default class IpcClient extends EventEmitter {
    handle: string;
    curPromises: { [id: number]: { resolve: any, reject: any } } = {};
    eventCount: number = 0;

    send(message: string, ...args: any[]): Promise<any> {
        var id = this.eventCount++;
        ipc.send("paired-message", {handle: this.handle, id: id, message: message, args: args});
        return new Promise((resolve, reject) => {
            this.curPromises[id] = { resolve: resolve, reject: reject };
        });
    }

    resolve(id: number, err: any, res: any) {
        if (err === null) {
            this.curPromises[id].resolve(res);
        } else {
            this.curPromises[id].reject(err);
        }
        delete this.curPromises[id];
    }

    constructor() {
        super();
        this.handle = ipc.sendSync("paired-request-handle");
        clients[this.handle] = this;
    }
}

ipc.on("paired-result", function(e, res) {
    clients[res.handle].resolve(res.id, res.err, res.res);
});

ipc.on("paired-reply", function(e, res) {
    clients[res.handle].emit(res.channel, ...res.args);
});
