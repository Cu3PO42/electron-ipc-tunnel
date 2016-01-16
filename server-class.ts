/// <reference path="typings/node/node.d.ts"/>

import events = require("events");

class IpcServer extends events.EventEmitter {
}

export = IpcServer;
