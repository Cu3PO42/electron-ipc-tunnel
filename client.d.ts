export default class IpcClient {
    handle: string;
    curPromises: {
        [id: number]: {
            resolve: any;
            reject: any;
        };
    };
    eventCount: number;
    send(message: string, ...args: any[]): Promise<{}>;
    resolve(id: number, err: any, res: any): void;
    constructor();
}
