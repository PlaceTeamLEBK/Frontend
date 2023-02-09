window.addEventListener("load", (event) => {
    placeteam = {};

    placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d");
    placeteam.ctx.imageSmoothingEnabled = false;
    placeteam.init = (pixelmap) => {


        
    };
    placeteam.update = (updatedata) => {
        updatedata.data.pixels.forEach((pixel) => {
            placeteam.setPixel(pixel.position.x,pixel.position.y,pixel.color)
        });
    };
    //change pixel locally
    placeteam.setPixel = (x,y,color) => {    
        placeteam.ctx.fillStyle = color;
        placeteam.ctx.fillRect(x, y, 1, 1);
    };
    //change pixel on server
    placeteam.set = (x,y,color) => {
        placeteam.websocket.send({
            "command": "set",
            "key": "5251d829377e9590737d859d04bf3e0e17091e5cd62626c92e7af82d9efc602f",
            "timeStamp": Date.now(),
            "data": {
              "pixel": {
                "color": color,
                "position": {
                  "x": x,
                  "y": y
                }
              }
            }
        });
    }

    // Get coordinates of clicked position on canvas
    function getCursorPosition(canvas, event) {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / (canvas.width * canvas.clientWidth);
      const y = event.clientY - rect.top  / (canvas.height * canvas.clientHeight);
      console.log("x: " + x + " y: " + y);
    }
  
    const canvas = document.querySelector('.mapcontainer canvas')
    canvas.addEventListener('mousedown', function(e) {
        getCursorPosition(canvas, e);
    });
});