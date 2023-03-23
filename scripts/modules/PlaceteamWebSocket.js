export class PlaceteamWebSocket {
    placeteam = null;
    canvasManipulator = null;

    webSocket = null;

    constructor(placeteam, canvasManipulator) {
        this.placeteam = placeteam;
        this.canvasManipulator = canvasManipulator;
    }

    // Register at Socket
    Init() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if(urlParams.get('testing')){//testing
            let test = {
                "command": "update",
                "timeStamp": 1675328548,
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
        data.pixels.forEach((line,y) => {
            line.forEach((pixel,x)  =>{
                this.canvasManipulator.SetPixel(x,y,pixel.color)
            });
        });        
    }

    // Process update from websocket
    Update(updatedata) {
        updatedata.data.pixels.forEach((pixel) => {
            this.canvasManipulator.SetPixel(pixel.position.x,pixel.position.y,pixel.color)
        });
    }

    // Change pixel on server
    Set(x,y,color) {
        if(this.placeteam.cooldown < 1){
            this.webSocket.send({
                "command": "set",
                "key": "5251d829377e9590737d859d04bf3e0e17091e5cd62626c92e7af82d9efc602f",
                "timeStamp": Date.now(),
                "data": {
                    "color": color,
                    "position": {
                        "x": x,
                        "y": y
                    }
                }
            });
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
            // Register at websocket
            _self.webSocket.send({
                "command": "init",
                "key": "5251d829377e9590737d859d04bf3e0e17091e5cd62626c92e7af82d9efc602f",//replace w cookie
                "timeStamp": Date.now()
            });

            console.log("[open] Connection established");
            console.log("Sending to server");
            // socket.send("My name is John");
        };

        // On update from server
        this.webSocket.onmessage = function(event) {
            if(event.data.command == 'paint'){
                _self.BuildFromArray(event.data);
            }
            else if(event.data.command == 'update'){
                _self.Update(event.data);
            }
            else if(event.data.command == 'cooldown'){
                _self.placeteam.setTimer(event.data.seconds);
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
        };
        //
        this.webSocket.onerror = function(error) {
            console.log(`[error]`,error);
        };
    }
}