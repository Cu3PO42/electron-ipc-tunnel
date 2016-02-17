/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/github-electron/github-electron.d.ts" />

import { ipcMain as ipc } from "electron";

var counter = 1;

ipc.on("paired-request-handle", function(event, arg) {
    event.returnValue = counter++;
});

var handler: { [message: string]: (...args: any[]) => Promise<any> } = {};

export default function register(message: string, fn: (...args: any[]) => Promise<any>) {
    handler[message] = fn;
}

function serializeError(e: Error) {
    return {
        message: e.message,
        name: e.name,
        props: Object.assign({}, e)
    }
}

ipc.on("paired-message", async function(event, args) {
    try {
        var res = await handler[args.message](function(channel: string, ...nargs: any[]) {
            if (args.handle !== undefined) {
                event.sender.send("paired-reply", { channel: channel, args: nargs, handle: args.handle });
            }
        }, ...args.args);
        event.sender.send("paired-result", { handle: args.handle, id: args.id, res: res, err: null });
    } catch (e) {
        event.sender.send("paired-result", { handle: args.handle, id: args.id, err: serializeError(e) });
    }
});
