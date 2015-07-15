# electron-ipc-tunnel
Create tunneled connections over Electron's interprocess communication module.

The `ipc` module is great for interprocess communication, but lacks the ability to have dedicated endpoints. I.e. you might have multiple instances of the same code running in the browser that needs to communicate with the same backend service. Unfortunately there is no way to differentiate these instances other than by introducing message IDs, giving each instance a unique handle, etc.  
This module abstracts that away.

## Usage
### On the client side

Create a new instance of `IpcClient` and use it like you would the `ipc` module. Note: At this time a `sendSync` method is not available, since this abstraction is not needed for synchronous messages.

    var IpcClient = require("electron-ipc-tunnel/client");

    var client = new IpcClient();

    client.on("reply", function(arg) {
        console.log("I received " + arg);
    })

    client.send("message", "foo");

### On the server side

This module exposes a singleton to use on the server side, similar to the `ipc` module. The only difference is the signature for the callback.

    var server = require("electron-ipc-tunnel/server");

    server.on("message", function(reply, arg) {
        console.log("I received " + arg);
        console.log("Echoing!");
        reply(arg);
    })

A callback function will always receive the callback it needs to call to reply and the argument passed by the client.

## Implementation

Upon creation an `IpcClient` gets a unique handle for itself from the server synchronously. It then wraps any message originating from `send` inside a *paired-message*, which includes the channel, the passed argument and the unique client handle, that is sent over IPC. On the server side this message is unwrapped, emitting an event on the server object with the right channel and argument, passing a reply function, that will again, wrap the reply, which will be unwrapped on the client side.
