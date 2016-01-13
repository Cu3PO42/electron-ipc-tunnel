/// <reference path="typings/node/node.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events = require("events");
var IpcServer = (function (_super) {
    __extends(IpcServer, _super);
    function IpcServer() {
        _super.apply(this, arguments);
    }
    return IpcServer;
})(events.EventEmitter);
module.exports = IpcServer;
