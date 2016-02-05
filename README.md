# electron-ipc-tunnel
Create tunneled connections over Electron's interprocess communication module.

The `ipc` module is great for interprocess communication, but lacks the ability to have dedicated endpoints. I.e. you might have multiple instances of the same code running in the browser that needs to communicate with the same backend service. Unfortunately there is no way to differentiate these instances other than by introducing message IDs, giving each instance a unique handle, etc.  
This module abstracts that away.  
In my experience I also want exactly one response from a query I send, that is, I basically want to call a method over IPC asynchronously. This is greatly simplified with this module as it will return a `Promise` of the return value.

## Usage
### On the client side

Create a new instance of `IpcClient` and call the `send` method to send an asynchronous method. You will get a promise of the return value.

    import IpcClient from "electron-ipc-tunnel/client";
    // var IpcClient = require("electron-ipc-tunnel/client").default;

    var client = new IpcClient();

    var result = await client.send("message", "foo");

### On the server side

This module exposes a single function to use on the server side to register handlers.

    import { registerIpc } from "electron-ipc-tunnel/server";
    // var registerIpc = require("electron-ipc-tunnel/server").registerIpc;

    registerIpc("message", async function(reply, arg1, arg2) {
        console.log(`Received message with args: ${arg1} ${arg2}`);
        reply("intermediate-update", "I'm still calculating foo!");
        return "foo";
    });

A callback function will always receive a callback to send a message to the client. It returns a `Promise` for the value to send to the client. As such the `reply` callback should only be used if we need to send multiple/intermediate messages, e.g. to report a percentage of the progress.

## Implementation

Upon creation an `IpcClient` gets a unique handle for itself from the server synchronously. It then wraps any message originating from `send` inside a *paired-message*, which includes the channel, the passed arguments, the unique client handle and the internal message id, that is sent over IPC. The method returns a promise and stores `resolve` and `reject` handlers internally.  
On the server side this message is unwrapped, calling a registered handler for the message type with the given arguments, passing a reply function, that will again, wrap the reply, which will be unwrapped on the client side. The server also waits for the `Promise` returned from the handler to resolve and sends an appropriate message to the client, which then resolves or rejects the Promise returned by `send`.
