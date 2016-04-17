/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/github-electron/github-electron.d.ts" />

import { ipcRenderer as ipc } from "electron";
import { EventEmitter } from "events";

function deserializeError(e) {
    var res = new Error(e.message);
    res.name = e.name;
    Object.assign(res, e.props); 
    return res;
}

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
            this.curPromises[id].reject(deserializeError(err));
        }
        delete this.curPromises[id];
    }

    constructor() {
        super();
        this.handle = ipc.sendSync("paired-request-handle");
        clients[this.handle] = this;
    }
}

var unboundPromiseId = 0;
var unboundPromises: { [id: number]: { resolve: any, reject: any } } = {};

export function send(message: string, ...args: any[]) {
    var id = unboundPromiseId++;
    ipc.send("paired-message", {id, message, args});
    return new Promise((resolve, reject) => {
        unboundPromises[id] = { resolve, reject };
    });
}

ipc.on("paired-result", function(e, res) {
    if (res.handle !== undefined) {
        clients[res.handle].resolve(res.id, res.err, res.res);
    } else {
        if (res.err === null) {
            unboundPromises[res.id].resolve(res.res);
        } else {
            unboundPromises[res.id].reject(deserializeError(res.err));
        }
        delete unboundPromises[res.id];
    }
});

ipc.on("paired-reply", function(e, res) {
    clients[res.handle].emit(res.channel, ...res.args);
});
