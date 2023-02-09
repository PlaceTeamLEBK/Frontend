window.addEventListener("load", (event) => {
    placeteam = {};

    placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d");
    placeteam.init = (pixelmap) => {


        
    };
    placeteam.update = (updatedata) => {
        updatedata.data.pixels.forEach((pixels) => {
            placeteam.setPixel(pixel.position.x,pixel.position.y,pixel.color)
        });
    };
    placeteam.setPixel = (x,y,color) => {    
        placeteam.ctx.fillStyle = color;
        placeteam.ctx.fillRect(x, y, 1, 1);
    };
});