window.addEventListener("load", (event) => {
    var arr = new Array(200), i, l;
    for(i = 0, l = 200; i < l; i++) {
        arr[i] = new Array(200);
    }
    arr.forEach((lines,y) => {
        lines.forEach((pixelcolor,x) => {
            pixelcolor = '#'+Math.floor(Math.random()*16777215).toString(16);
        });
    });
    placeteam.init(arr);
});