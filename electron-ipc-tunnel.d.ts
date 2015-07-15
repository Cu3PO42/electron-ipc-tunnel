// Type definitions for Node.js v0.12.0
// Project: http://nodejs.org/
// Definitions by: Microsoft TypeScript <http://typescriptlang.org>, DefinitelyTyped <https://github.com/borisyankov/DefinitelyTyped>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/************************************************
*                                               *
*               Node.js v0.12.0 API             *
*                                               *
************************************************/

/************************************************
*                                               *
*                   GLOBAL                      *
*                                               *
************************************************/

/************************************************
*                                               *
*               GLOBAL INTERFACES               *
*                                               *
************************************************/
declare module Node {
    export interface EventEmitter {
        addListener(event: string, listener: Function): EventEmitter;
        on(event: string, listener: Function): EventEmitter;
        once(event: string, listener: Function): EventEmitter;
        removeListener(event: string, listener: Function): EventEmitter;
        removeAllListeners(event?: string): EventEmitter;
        setMaxListeners(n: number): void;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
    }
}

/************************************************
*                                               *
*                   MODULES                     *
*                                               *
************************************************/

declare module "events" {
    export class EventEmitter implements Node.EventEmitter {
        static listenerCount(emitter: EventEmitter, event: string): number;

        addListener(event: string, listener: Function): EventEmitter;
        on(event: string, listener: Function): EventEmitter;
        once(event: string, listener: Function): EventEmitter;
        removeListener(event: string, listener: Function): EventEmitter;
        removeAllListeners(event?: string): EventEmitter;
        setMaxListeners(n: number): void;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
   }
}

// Type definitions for Electron 0.25.2 (shared between main and rederer processes)
// Project: http://electron.atom.io/
// Definitions by: jedmao <https://github.com/jedmao/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module Electron {
	class Ipc extends Node.EventEmitter {
		on(channel: string, callback: (event: any, arg: any) => void): Ipc;
		once(channel: string, callback: (event: any, arg: any) => void): Ipc;
		addListener(channel: string, callback: (event: any, arg: any) => void): Ipc;
		removeListener(channel: string): Ipc;
		removeAllListeners(): Ipc;
		setMaxListeners(count: number): void;
		listeners(channel: string): ((event: any, arg: string) => void)[];
		emit(channel: string, ...args: any[]): boolean;
		send(channel: string, arg?: any): void;
		sendSync(channel: string, arg?: any): any;
	}
}

declare module "ipc" {
	var ipc: Electron.Ipc;
	export = ipc;
}

declare module 'electron-ipc-tunnel/client' {
	/// <reference path="typings/node/node.d.ts" />
	/// <reference path="typings/github-electron/github-electron.d.ts" />
	import events = require("events"); class IpcClient extends events.EventEmitter {
	    handle: number;
	    send(channel: string, val?: any): void;
	    constructor();
	}
	export = IpcClient;

}
declare module 'electron-ipc-tunnel/server-class' {
	/// <reference path="typings/node/node.d.ts" />
	import events = require("events"); class IpcServer extends events.EventEmitter {
	}
	export = IpcServer;

}
declare module 'electron-ipc-tunnel/server' {
	/// <reference path="typings/node/node.d.ts" />
	/// <reference path="typings/github-electron/github-electron.d.ts" />
	import IpcServer = require("server-class"); var server: IpcServer;
	export = server;

}
declare module 'electron-ipc-tunnel/index' {
	import Client = require("client");
	import IpcServer = require("server-class");
	export = : {
	    Client: typeof Client;
	    Server: IpcServer;
	};

}
