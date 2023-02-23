window.addEventListener("load", (event) => {
    placeteam = {};

    const zoomSpeed = 2;
    const maximumClickDownTimeToPlacePixel = 125;

    mouseIsDown = false;
    rightclickIsDown = false;
    lastMouseDown = 0;
    minZoomPercentageMobile = 270;
    minZoomPercentageDesktop = 100;
    getParameterUpdateInterval = 1000;

    desktopMediaQuery = window.matchMedia("(min-width: 756px)");

    placeteam.mapcontainer = document.querySelector('.mapcontainer');
    placeteam.canvas = document.getElementById("pixelcanvas");
    placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d",{ willReadFrequently: true });
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
            placeteam.changeColor(element.value,element.dataset.colorid);

            // let selectelement = placeteam.colorcontainer.querySelector('.select>div[data-colorid="'+element.dataset.colorid+'"]');
            // selectelement.style.backgroundColor = element.value;
            // placeteam.colors[element.dataset.colorid] = element.value;
            // localStorage.setItem("colors",JSON.stringify(placeteam.colors));
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
    //add event for zoomrange
    document.getElementById("range_zoom").addEventListener('change', function(event){
        //change zoom
    });
    //add event for zoombutton +
    document.getElementById("btn_zoom_plus").addEventListener('click', function(event){
        //change zoom
    });
    //add event for zoombutton -
    document.getElementById("btn_zoom_minus").addEventListener('click', function(event){
        //change zoom
    });
    //add event for fullscreenbutton
    document.getElementById("btn_fullscreen").addEventListener('click', function(event){
        //change zoom
    });
    //process update from websocket
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
    // changes color of id  to Hex value
    placeteam.changeColor = (color, id) => {
            let selectelement = placeteam.colorcontainer.querySelector('.select>div[data-colorid="'+id+'"]');
            selectelement.style.backgroundColor = color;
            placeteam.colors[id] = color;
            localStorage.setItem("colors",JSON.stringify(placeteam.colors));
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
        // const rect = canvas.getBoundingClientRect();

        // Gets the coordinates of the clicked position on the canvas, converts them to the pixel coordinates of the canvas,
        // and rounds them down. Oddly enough,  clicking on the very edge of the element can cause it to return numbers that are too
        // high or too low, so we have to clamp it
        // const x = Math.floor(Math.max(Math.min(((event.clientX - rect.left) / canvas.clientWidth) * canvas.width, canvas.width - 1), 0));
        // const y = Math.floor(Math.max(Math.min(((event.clientY - rect.top)  / canvas.clientWidth) * canvas.height, canvas.height - 1), 0));
        let mouseCoordinates = placeteam.getCoordinateslAtMouse(event);
        // placeteam.setPixel(x, y, placeteam.colorinput.value);
        placeteam.setPixel(mouseCoordinates.x, mouseCoordinates.y, placeteam.colors[placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid]);
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
        placeteam.mapcontainer.scrollTo(Math.ceil(pixelSize * x), Math.ceil(pixelSize * y));
    }

    placeteam.getCoordinateslAtMouse = (event)=> {
        const rect = placeteam.canvas.getBoundingClientRect()
        const x = Math.floor(Math.max(Math.min(((event.clientX - rect.left) /  placeteam.canvas.clientWidth) *  placeteam.canvas.width,  placeteam.canvas.width - 1), 0));
        const y = Math.floor(Math.max(Math.min(((event.clientY - rect.top)  /  placeteam.canvas.clientWidth) *  placeteam.canvas.height,  placeteam.canvas.height - 1), 0));
        return {x:x,y:y};
    };

    placeteam.canvas.addEventListener('mousedown', function(event) {

        if(event.which == 1){//left click
            lastMouseDown = Date.now();   
            mouseIsDown = true;
            placeteam.changeCanvasCursor('grab');
        }
        else if (event.which == 3){//right click   
            rightclickIsDown = true;
           placeteam.changeCanvasCursor('crosshair');
        }
    });

    placeteam.canvas.addEventListener('mouseup', function(event) {
        if (Date.now() - lastMouseDown < maximumClickDownTimeToPlacePixel) {
            placePixelOnCanvas(placeteam.canvas, event);
        }
        mouseIsDown = false;
        rightclickIsDown = false;
        placeteam.changeCanvasCursor();
    });

    // Zoom on scrolling
    placeteam.canvas.addEventListener('wheel', function(event) {
        minZoom = minZoomPercentageMobile;
        if (desktopMediaQuery.matches) {
            minZoom = minZoomPercentageDesktop;
        }

        newCanvasWidth = Math.max(minZoom, placeteam.getCanvasWidthPercentageInt() + Math.sign(event.deltaY) * zoomSpeed);

        placeteam.setZoom(newCanvasWidth);
    });

    placeteam.setZoom = (newCanvasWidth) => {
        if (parseInt(newCanvasWidth)) {
            initialWidth = placeteam.canvas.clientWidth;

            placeteam.canvas.style.cssText = 'width: ' + newCanvasWidth + '%;';

            newWidth = placeteam.canvas.clientWidth;
            halfWidthDifference = (newWidth - initialWidth) / 2;
            //placeteam.mapcontainer.scrollBy(halfWidthDifference, halfWidthDifference);    
        }
    }

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
        if(rightclickIsDown){
            let mouseCoordinates =  placeteam.getCoordinateslAtMouse(event);
            let rgbarray = placeteam.ctx.getImageData(mouseCoordinates.x, mouseCoordinates.y, 1, 1).data; 
            placeteam.changeColor("#"+placeteam.rgbToHex(rgbarray[0],rgbarray[1],rgbarray[2]),placeteam.colorcontainer.querySelector('.select .selected').dataset.colorid);
        }
    });

    // Use GET parameters
    placeteam.useGetParemeters = () => {
        urlSearchParams = new URLSearchParams(window.location.search);

        placeteam.setZoom(urlSearchParams.get("zoom"));
        placeteam.offsetScrollToPixel(parseInt(urlSearchParams.get("x")), parseInt(urlSearchParams.get("y")));
    }
    placeteam.useGetParemeters();

    // Update GET parameters
    placeteam.setGetParameters = () => {
        url = new URL(window.location.href);
        currentCanvasWidth = placeteam.getCanvasWidthPercentageInt();

        pixelSize = placeteam.getPixelSize();
        pixelsToLeft = Math.floor(placeteam.mapcontainer.scrollLeft / pixelSize);
        pixelsToTop = Math.floor(placeteam.mapcontainer.scrollTop / pixelSize);

        url.searchParams.set('x', pixelsToLeft);
        url.searchParams.set('y', pixelsToTop);
        url.searchParams.set('zoom', currentCanvasWidth);
        window.history.replaceState(null,"", url);
    }
    placeteam.getParameterTimer = setInterval(placeteam.setGetParameters, getParameterUpdateInterval);

    placeteam.rgbToHex = (r, g, b) => {
        if (r > 255 || g > 255 || b > 255)
            throw "Invalid color component";
        return ((r << 16) | (g << 8) | b).toString(16);
    }
    //disable context menu for right click;
    placeteam.canvas.addEventListener('contextmenu', (ev)=>{
        ev.preventDefault(); // this will prevent browser default behavior 
      });
    //change cursor for canvas events, no argument resets cursor 
    placeteam.changeCanvasCursor = (cursortype=null) => {
        placeteam.canvas.style.cursor = cursortype;
    };
});