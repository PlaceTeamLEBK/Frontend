window.addEventListener("load", (event) => {
    placeteam.websocket = new WebSocket('ws://'+window.location.host+'/websocket, protocols)');

    //open websocket and receive Data
    placeteam.websocket.onopen = function(e) {
        console.log("[open] Connection established");
        console.log("Sending to server");
        socket.send("My name is John");
    };

    //on update from server
    placeteam.websocket.onmessage = function(event) {
        console.log(`[message] Data received from server:    ${event.data}`);
    };

    //send update to server
    placeteam.websocket.send()
    //closing connection
    placeteam.websocket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
    }
    };
    //
    placeteam.websocket.onerror = function(error) {
        console.log(`[error]`,error);
    };
});