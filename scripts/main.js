placeteam = {};

placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d");
placeteam.init = (pixelmap) => {
    pixelmap.forEach((lines,y) => {
        lines.forEach((pixelcolor,x) => {
            placeteam.setPixel(x,y,pixelcolor);
        });
    });

};
placeteam.setPixel = (x,y,color) => {    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
};