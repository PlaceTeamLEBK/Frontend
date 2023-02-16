window.addEventListener("load", (event) => {
    placeteam = {};

    const zoomSpeed = 2;
    const maximumClickDownTimeToPlacePixel = 125;

    mouseIsDown = false;
    lastMouseDown = 0;

    placeteam.mapcontainer = document.querySelector('.mapcontainer');
    placeteam.canvas = document.getElementById("pixelcanvas");
    placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d");
    placeteam.colorcontainer = document.getElementById("colorcontainer");
    placeteam.colorinput = placeteam.colorcontainer.querySelector('input');
    placeteam.status = document.getElementById("statuscontainer");
    placeteam.editcolorbutton = document.getElementById("editcolorbutton");
    placeteam.colors = ['#000000','#ffffff','#fff100','#ff8c00','#e81123','#009e49','#00188f','#68217a','#00bcf2','#bad80a'];//save to session late?
    placeteam.colorbuttons = [];
    placeteam.ctx.imageSmoothingEnabled = false;
    placeteam.init = (pixelmap) => {


        
    };
    
    //load color buttons and divs to array and add event
    placeteam.colorcontainer.querySelectorAll('.edit input').forEach((element, index) => {
        element.addEventListener('change', function(event){
            let selectelement = placeteam.colorcontainer.querySelector('.select>div[data-colorid="'+element.data.colorid+'"]');
            selectelement.style.backgroundColor = element.value;
            placeteam.colors[element.data.colorid] = element.value;
        });
    });
    placeteam.editcolorbutton.addEventListener('click', function(event){
        placeteam.colorcontainer.querySelector('div.edit').classList.toggle('hidden');
        placeteam.colorcontainer.querySelector('div.select').classList.toggle('hidden');
    });

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
    // placeteam.colorcontainer.querySelectorAll('input').forEach((element) => {
    //     placeteam.colorbuttons.add({select:'',pick:element});
    // });
    placeteam.editcolorbutton.addEventListener('click', function(event){
        placeteam.colorcontainer.querySelector('div.edit').classList.toggle('hidden');
        placeteam.colorcontainer.querySelector('div.select').classList.toggle('hidden');
    });

    // Place pixel on clicked part of canvas
    function placePixelOnCanvas(canvas, event) {
        const rect = canvas.getBoundingClientRect();

        // Gets the coordinates of the clicked position on the canvas, converts them to the pixel coordinates of the canvas,
        // and rounds them down. Oddly enough,  clicking on the very edge of the element can cause it to return numbers that are too
        // high or too low, so we have to clamp it
        const x = Math.floor(Math.max(Math.min(((event.clientX - rect.left) / canvas.clientWidth) * canvas.width, canvas.width - 1), 0));
        const y = Math.floor(Math.max(Math.min(((event.clientY - rect.top)  / canvas.clientWidth) * canvas.height, canvas.height - 1), 0));

        placeteam.setPixel(x, y, placeteam.colorinput.value);
        console.log("x: " + x + " y: " + y);
    }

    placeteam.canvas.addEventListener('mousedown', function(event) {
        lastMouseDown = Date.now();
        mouseIsDown = true;
    });

    placeteam.canvas.addEventListener('mouseup', function(event) {
        if (Date.now() - lastMouseDown < maximumClickDownTimeToPlacePixel) {
            placePixelOnCanvas(placeteam.canvas, event);
        }
        mouseIsDown = false;
    });

    // Zoom on scrolling
    placeteam.canvas.addEventListener('wheel', function(event) {
        currentCanvasWidth = parseInt(placeteam.canvas.style.width.match(/(\d+)/));
        currentCanvasWidth = Math.max(100, currentCanvasWidth + Math.sign(event.deltaY) * zoomSpeed);
        if (currentCanvasWidth <= 100) {
            placeteam.mapcontainer.style.cssText = "";
        } else {
            placeteam.mapcontainer.style.cssText = "overflow: scroll;";
        }
        initialWidth = placeteam.canvas.clientWidth;
        placeteam.canvas.style.cssText = 'width: ' + currentCanvasWidth + '%;';
        newWidth = placeteam.canvas.clientWidth;
        halfWidthDifference = (newWidth - initialWidth) / 2;
        placeteam.mapcontainer.scrollBy(halfWidthDifference, halfWidthDifference);
    });

    placeteam.mapcontainer.addEventListener('wheel', function(event) {
        event.preventDefault();
    });

    // Pan with mouse
    placeteam.canvas.addEventListener("mousemove", function(event) {
        if (mouseIsDown) {
            offsetX = event.movementX * -1;
            offsetY = event.movementY * -1;
    
            placeteam.mapcontainer.scrollBy(offsetX, offsetY);
        }
    });
});