/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/github-electron/github-electron.d.ts" />

import electron = require("electron");
const ipc = electron.ipcMain;
import IpcServer = require("./server-class");

var counter = 1;

ipc.on("paired-request-handle", function(event, arg) {
    event.returnValue = counter++;
});

var server = new IpcServer();

ipc.on("paired-message", function(event, args) {
    server.emit(args.channel, function(channel, reply) {
        event.sender.send("paired-reply", {handle: args.handle, channel: channel, msg: reply});
    }, args.msg)
})

export = server;
