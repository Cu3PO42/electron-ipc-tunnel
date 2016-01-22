"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new P(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.call(thisArg, _arguments)).next());
    });
};
var electron_1 = require("electron");
var counter = 1;
electron_1.ipcMain.on("paired-request-handle", function (event, arg) {
    event.returnValue = counter++;
});
var handler = {};
function register(message, fn) {
    handler[message] = fn;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
electron_1.ipcMain.on("paired-message", function (event, args) {
    return __awaiter(this, void 0, Promise, function* () {
        try {
            var res = yield handler[args.message].apply(null, args.args);
            event.sender.send("paired-reply", { handle: args.handle, id: args.id, res: res, err: null });
        }
        catch (e) {
            event.sender.send("paired-reply", { handle: args.handle, id: args.id, err: e });
        }
    });
});
