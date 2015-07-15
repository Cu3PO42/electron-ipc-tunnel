/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/github-electron/github-electron.d.ts" />

import ipc = require("ipc");
import events = require("events");

var clients: { [handle: number]: IpcClient; } = {};

class IpcClient extends events.EventEmitter {
    handle: number;

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
