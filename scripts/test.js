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
});