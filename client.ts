/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/github-electron/github-electron.d.ts" />

import electron = require("electron");
const ipc = electron.ipcRenderer;
import events = require("events");

var clients: { [handle: string]: IpcClient; } = {};

class IpcClient extends events.EventEmitter {
    handle: string;

    send(channel: string, val?: any) {
        ipc.send("paired-message", {handle: this.handle, channel: channel, msg: val});
    }

    constructor() {
        super();
        this.handle = ipc.sendSync("paired-request-handle");
        clients[this.handle] = this;
    }
}


ipc.on("paired-reply", function(res) {
    clients[res.handle].emit(res.channel, res.msg);
});

export = IpcClient;
