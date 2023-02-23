window.addEventListener("load", (event) => {
    placeteam = {};

    const zoomSpeed = 2;
    const maximumClickDownTimeToPlacePixel = 125;

    mouseIsDown = false;
    lastMouseDown = 0;
    minZoomPercentageMobile = 270;
    minZoomPercentageDesktop = 100;

    desktopMediaQuery = window.matchMedia("(min-width: 756px)");

    placeteam.mapcontainer = document.querySelector('.mapcontainer');
    placeteam.canvas = document.getElementById("pixelcanvas");
    placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d");
    placeteam.colorcontainer = document.getElementById("colorcontainer");
    placeteam.status = document.getElementById("statuscontainer");
    placeteam.editcolorbutton = document.getElementById("editcolorbutton");
    placeteam.colors = ['#000000','#ffffff','#fff100','#ff8c00','#e81123','#009e49','#00188f','#68217a','#00bcf2','#bad80a'];
    placeteam.ctx.imageSmoothingEnabled = false;
    placeteam.init = (pixelmap) => {


        
    };
    //load colors
    placeteam.loadcolors = () => {
        let localcolors = localStorage.getItem("colors");
        if(localcolors != null)
            placeteam.colors=JSON.parse(localcolors);
        //load from sessionstorage eventually;
        placeteam.colors.forEach((color,index)=>{
            placeteam.colorcontainer.querySelector('input[data-colorid="'+index+'"]').value=color;
            placeteam.colorcontainer.querySelector('div[data-colorid="'+index+'"]').style.backgroundColor=color;
        });
    };
    placeteam.loadcolors();
    //add events for colorinput change
    placeteam.colorcontainer.querySelectorAll('.edit input').forEach((element, index) => {
        element.addEventListener('change', function(event){
            let selectelement = placeteam.colorcontainer.querySelector('.select>div[data-colorid="'+element.dataset.colorid+'"]');
            selectelement.style.backgroundColor = element.value;
            placeteam.colors[element.dataset.colorid] = element.value;
            localStorage.setItem("colors",JSON.stringify(placeteam.colors));
        });
    });
    //add events for colorselect
    placeteam.colorcontainer.querySelectorAll('.select>div').forEach((newselectelement) => {
        newselectelement.addEventListener('click',function(event){
            placeteam.colorcontainer.querySelectorAll('.select>div').forEach((element)=>{
                element.classList.remove('selected')
            })
            newselectelement.classList.add('selected');
        });
    });
    //add event for toggle editmode
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
    // Place pixel on clicked part of canvas
    function placePixelOnCanvas(canvas, event) {
        const rect = canvas.getBoundingClientRect();

        // Gets the coordinates of the clicked position on the canvas, converts them to the pixel coordinates of the canvas,
        // and rounds them down. Oddly enough,  clicking on the very edge of the element can cause it to return numbers that are too
        // high or too low, so we have to clamp it
        const x = Math.floor(Math.max(Math.min(((event.clientX - rect.left) / canvas.clientWidth) * canvas.width, canvas.width - 1), 0));
        const y = Math.floor(Math.max(Math.min(((event.clientY - rect.top)  / canvas.clientWidth) * canvas.height, canvas.height - 1), 0));

        // placeteam.setPixel(x, y, placeteam.colorinput.value);
        placeteam.setPixel(x, y, placeteam.colors[placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid]);
        console.log("x: " + x + " y: " + y);
    }

    placeteam.getCanvasWidthPercentageInt = () => {
        return parseInt(placeteam.canvas.style.width.match(/(\d+)/));
    }

    placeteam.getPixelSize = () => {
        return placeteam.canvas.clientWidth / placeteam.canvas.width;
    }

    placeteam.offsetScrollToPixel = (x, y) => {
        pixelSize = placeteam.getPixelSize();
        placeteam.mapcontainer.scrollTo(parseInt((pixelSize * x).toPrecision(1)), parseInt((pixelSize * y).toPrecision(1)));
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
        minZoom = minZoomPercentageMobile;
        if (desktopMediaQuery.matches) {
            minZoom = minZoomPercentageDesktop;
        }

        currentCanvasWidth = Math.max(minZoom, placeteam.getCanvasWidthPercentageInt() + Math.sign(event.deltaY) * zoomSpeed);
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