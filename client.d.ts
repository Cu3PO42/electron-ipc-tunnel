import { EventEmitter } from "events";
export default class IpcClient extends EventEmitter {
    handle: string;
    curPromises: {
        [id: number]: {
            resolve: any;
            reject: any;
        };
    };
    eventCount: number;
    send(message: string, ...args: any[]): Promise<any>;
    resolve(id: number, err: any, res: any): void;
    constructor();
}
export declare function send(message: string, ...args: any[]): Promise<{}>;
