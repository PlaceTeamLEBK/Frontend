export class PlaceteamWebSocket {
    placeteam = null;
    canvasManipulator = null;

    webSocket = null;

    constructor(placeteam) {
        this.placeteam = placeteam;
    }

    SetCanvasManipulator(canvasManipulator){
        this.canvasManipulator = canvasManipulator;
    }

    // Register at Socket
    Init() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.get('testing')){//testing
            let test = {
                "command": "update",
                "data": {"pixels":[]}
            };
            for(let x = 0; x < 200; x++) {
                for(let y = 0; y < 200; y++) {
                    test.data.pixels.push({
                        "color": '#'+Math.floor(Math.random()*16777215).toString(16),
                        "position": {
                            "x": x,
                            "y": y
                        }
                    });
                }
            }
            this.Update(test);
        }
        else{
            this.LoadWebSocket();
        }
        this.placeteam.setTimer(30);
    }

    // Called from socket once the pixels are recieved
    BuildFromArray(data) {
        // data.cooldown;
        data.pixels.forEach((line, x) => {
            line.forEach((pixel, y)  =>{
                this.canvasManipulator.SetPixel(x, y, pixel)
            });
        });        
    }

    // Process update from websocket
    Update(data) {
        this.canvasManipulator.SetPixel(data.position.x, data.position.y, data.color);
    }

    // Change pixel on server
    Set(x,y,color) {
        if(this.placeteam.cooldown < 1){
            const key = this.GetKeyFromCookie();

            this.webSocket.send(
                JSON.stringify({
                    "command": "set",
                    "key": key,
                    "data": {
                        "color": color,
                        "position": {
                            "x": x,
                            "y": y
                        }
                    }
                })
            );
        }
    }

    LoadWebSocket() {
        const _self = this;
        if (location.protocol == "https:") {
            this.webSocket = new WebSocket('wss://'+window.location.host+'/websocket');
        } else {
            this.webSocket = new WebSocket('ws://'+window.location.host+'/websocket');
        }
    
        // Open websocket and receive Data
        this.webSocket.onopen = function(e) {
            const key = _self.GetKeyFromCookie();

            // Register at websocket
            _self.webSocket.send(
                JSON.stringify({
                    "command": "init",
                    "key": key
                })
            );

            console.log("[open] Connection established");
            console.log("Sending to server");
            // socket.send("My name is John");
        };

        // On update from server
        this.webSocket.onmessage = function(event) {
            const eventData = JSON.parse(event.data);
            if(eventData.command == 'paint'){
                _self.BuildFromArray(eventData.data);
                _self.placeteam.setTimer(eventData.data.cooldown);
            }
            else if(eventData.command == 'update'){
                _self.Update(eventData.data);
            }
            else if(eventData.command == 'cooldown'){
                _self.placeteam.setTimer(eventData.data.seconds);
            }
        };
    
        // Send update to server
        // placeteam.websocket.send()
        // Closing connection
        this.webSocket.onclose = function(event) {
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // e.g. server process killed or network down
                // Event.code is usually 1006 in this case
                console.log('[close] Connection died');
            }
            _self.Init();
        };
        //
        this.webSocket.onerror = function(error) {
            console.log(`[error]`,error);
        };
    }

    GetKeyFromCookie() {
        const decodedCookie = decodeURIComponent(document.cookie);
        // Assuming there is only one value stored in the cookie, this will return the value after the key
        return decodedCookie.split("=")[1];
    }
}