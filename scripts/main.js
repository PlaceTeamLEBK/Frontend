import { Navigation } from "./modules/navigation.mjs";
import { MouseState } from "./modules/mouseState.mjs";
import { PositionStorage } from "./modules/positionStorage.mjs";
import { CanvasManipulator } from "./modules/canvasManipulation.mjs";

window.addEventListener("load", (event) => {
    const placeteam = {};

    placeteam.zoomSpeed = 1.02;
    const maximumClickDownTimeToPlacePixel = 125;

    const mouseState = new MouseState();

    placeteam.minZoomPercentageMobile = 270;
    placeteam.minZoomPercentageTablet = 150;
    placeteam.minZoomPercentageDesktop = 100;
    placeteam.maxZoom = 400;
    placeteam.getParameterUpdateInterval = 1000;

    placeteam.tabletMediaQuery = window.matchMedia("(min-width: 756px)");
    placeteam.desktopMediaQuery = window.matchMedia("(min-width: 992px)");

    placeteam.mapcontainer = document.querySelector('.mapcontainer');
    placeteam.canvas = document.getElementById("pixelcanvas");
    placeteam.ctx = document.getElementById("pixelcanvas").getContext("2d",{ willReadFrequently: true });
    placeteam.colorcontainer = document.getElementById("colorcontainer");
    placeteam.status = document.getElementById("statuscontainer");
    placeteam.editcolorbutton = document.getElementById("editcolorbutton");
    placeteam.cooldownelement = placeteam.status.querySelector('.cooldown');
    placeteam.cooldown = null; //in seconds
    placeteam.colors = ['#000000','#ffffff','#fff100','#ff8c00','#e81123','#009e49','#00188f','#68217a','#00bcf2','#bad80a'];
    placeteam.ctx.imageSmoothingEnabled = false;
    placeteam.fullscreen = false;
    placeteam.rangezoom = document.getElementById("range_zoom");

    //register at Socket
    placeteam.init = () => {
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
            placeteam.update(test);
        }
        else{
            placeteam.loadWebsocket();
        }
        placeteam.setTimer(30);
    }
    //called from socket once the pixels are recieved
    placeteam.buildFromArray = (data) => {
        // data.cooldown;
        data.pixels.forEach((line,y) => {
            line.forEach((pixel,x)  =>{
                canvasManipulator.setPixel(x,y,pixel.color)
            });
        });        
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
    //change Max of zoom range
        placeteam.rangezoom.setAttribute("max",400);
    //add event for zoomrange
    placeteam.rangezoom.addEventListener('input', function(event){
        console.log(event);
        navigation.SetZoom(placeteam.rangezoom.value);
    });
    //add event for zoombutton +
    document.getElementById("btn_zoom_plus").addEventListener('click', function(event){
        let minZoom = placeteam.minZoomPercentageMobile;
        if (placeteam.desktopMediaQuery.matches) {
            minZoom = placeteam.minZoomPercentageDesktop;
        } else if (placeteam.tabletMediaQuery.matches) {
            minZoom = placeteam.minZoomPercentageTablet;
        }
        let newCanvasWidth = placeteam.getCanvasWidthPercentageInt() * placeteam.zoomSpeed;
        let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
        normalizedCanvasWidth = Math.min(placeteam.maxZoom, normalizedCanvasWidth);
        navigation.SetZoom(normalizedCanvasWidth);
    });
    //add event for zoombutton -
    document.getElementById("btn_zoom_minus").addEventListener('click', function(event){
        let minZoom = placeteam.minZoomPercentageMobile;
        if (placeteam.desktopMediaQuery.matches) {
            minZoom = placeteam.minZoomPercentageDesktop;
        } else if (placeteam.tabletMediaQuery.matches) {
            minZoom = placeteam.minZoomPercentageTablet;
        }
        let newCanvasWidth = placeteam.getCanvasWidthPercentageInt() / placeteam.zoomSpeed;
        let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
        normalizedCanvasWidth = Math.min(placeteam.maxZoom, normalizedCanvasWidth);
        navigation.SetZoom(normalizedCanvasWidth);
    });
    //add event for fullscreenbutton
    document.getElementById("btn_fullscreen").addEventListener('click', function(event){
        if(!placeteam.fullscreen){
            document.documentElement.requestFullscreen();
        }
        else{
            document.exitFullscreen();
        }
    });
    //process update from websocket
    placeteam.update = (updatedata) => {
        updatedata.data.pixels.forEach((pixel) => {
                canvasManipulator.setPixel(pixel.position.x,pixel.position.y,pixel.color)
        });
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
        if(placeteam.cooldown<1){
            placeteam.websocket.send({
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

    placeteam.getCanvasWidthPercentageInt = () => {
        return parseInt(placeteam.canvas.style.width.match(/(\d+)/));
    }

    placeteam.getPixelSize = () => {
        return placeteam.canvas.clientWidth / placeteam.canvas.width;
    }

    placeteam.offsetScrollToPixel = (x, y) => {
        const pixelSize = placeteam.getPixelSize();
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
            mouseState.lastMouseDown = Date.now();   
            mouseState.mouseIsDown = true;
            placeteam.changeCanvasCursor('grab');
        }
        else if (event.which == 3){//right click   
            mouseState.rightclickIsDown = true;
           placeteam.changeCanvasCursor('crosshair');
        }
    });

    placeteam.canvas.addEventListener('mouseup', function(event) {
        if (Date.now() - mouseState.lastMouseDown < maximumClickDownTimeToPlacePixel) {
            canvasManipulator.PlacePixelOnCanvas(placeteam.canvas, event);
        }
        mouseState.mouseIsDown = false;
        mouseState.rightclickIsDown = false;
        placeteam.changeCanvasCursor();
    });

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
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement===null) {
         placeteam.fullscreen=false;
        } else {
         placeteam.fullscreen=true;
        }
    });
    placeteam.setTimer = (cooldown) => {  
        var seconds = cooldown;
        clearInterval(placeteam.timerinterval);
        placeteam.timerinterval = setInterval(Cooldownminus, 1000);
        function Cooldownminus() {
            --seconds;
            placeteam.cooldownelement.innerHTML = seconds;
            placeteam.cooldown = seconds;
            if(seconds < 1){
                clearInterval(placeteam.timerinterval);
                placeteam.status.classList.add('hidden');
            }
        }   
        if(seconds>0){
            placeteam.status.classList.remove('hidden');
        }
    }
    placeteam.loadWebsocket = () =>{
        placeteam.websocket = new WebSocket('ws://'+window.location.host+'/websocket, protocols)');
    
        //open websocket and receive Data
        placeteam.websocket.onopen = function(e) {
            console.log("[open] Connection established");
            console.log("Sending to server");
            // socket.send("My name is John");
        };
    
        //on update from server
        placeteam.websocket.onmessage = function(event) {
            if(event.data.command == 'paint'){
                placeteam.buildFromArray(event.data);
            }
            else if(event.data.command == 'update'){
                placeteam.update(event.data);
            }
            else if(event.data.command == 'cooldown'){
                placeteam.setTimer(event.data.seconds);
            }
        };
    
        //send update to server
        // placeteam.websocket.send()
        //closing connection
        placeteam.websocket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            console.log('[close] Connection died');
        }
        };
        //
        placeteam.websocket.onerror = function(error) {
            console.log(`[error]`,error);
        };
        //register at websocket
        placeteam.websocket.send({
            "command": "init",
            "key": "5251d829377e9590737d859d04bf3e0e17091e5cd62626c92e7af82d9efc602f",//replace w cookie
            "timeStamp": Date.now()
        });
    }
    placeteam.init();
    
    const navigation = new Navigation(placeteam, mouseState);
    navigation.SetEvents();

    const positionStorage = new PositionStorage(placeteam, mouseState, navigation);
    positionStorage.LoadPositionStorage();
    positionStorage.SetPositionStorageUpdateTimer();

    const canvasManipulator = new CanvasManipulator(placeteam, mouseState, navigation);
});