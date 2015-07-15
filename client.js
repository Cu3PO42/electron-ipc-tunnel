/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/github-electron/github-electron.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ipc = require("ipc");
var events = require("events");
var clients = {};
var IpcClient = (function (_super) {
    __extends(IpcClient, _super);
    function IpcClient() {
        _super.call(this);
        this.handle = ipc.sendSync("paired-request-handle");
        clients[this.handle] = this;
    }
    IpcClient.prototype.send = function (channel, val) {
        ipc.send("paired-message", { handle: this.handle, channel: channel, msg: val });
    };
    return IpcClient;
})(events.EventEmitter);
ipc.on("paired-reply", function (res) {
    clients[res.handle].emit(res.channel, res.msg);
});
module.exports = IpcClient;
