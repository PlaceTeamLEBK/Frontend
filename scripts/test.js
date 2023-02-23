window.addEventListener("load", (event) => {
    var test = {
        "command": "update",
        "timeStamp": 1675328548,
        "data": {"pixels":[]}
    };
    for(x = 0; x < 200; x++) {
        for(y = 0; y < 200; y++) {
            test.data.pixels.push({
                "color": '#'+Math.floor(Math.random()*16777215).toString(16),
                "position": {
                  "x": x,
                  "y": y
                }
            });
        }
    }
    placeteam.update(test);
    placeteam.websocket.send({
        "command": "init",
        "key": "5251d829377e9590737d859d04bf3e0e17091e5cd62626c92e7af82d9efc602f",
        "timeStamp": Date.now()
      });
});