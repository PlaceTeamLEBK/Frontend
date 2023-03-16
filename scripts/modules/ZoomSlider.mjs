export class ZoomSlider {
    placeteam = null;
    navigation = null;
    canvasManipulator = null;

    zoomOptions = {
        In: "In",
        Out: "Out"
    };

    constructor(placeteam, navigation, canvasManipulator) {
        this.placeteam = placeteam;
        this.navigation = navigation;
        this.canvasManipulator = canvasManipulator;

        placeteam.rangezoom.setAttribute("max",400);
    }

    SetEvents() {
        this.SetZoomInEvent();
        this.SetZoomInEvent();
        this.SetZoomOutEvent();
        this.SetFullscreenEvent();
    }

    SetZoomInEvent() {
        let _self = this;
        document.getElementById("btn_zoom_plus").addEventListener('click', function(event){
            _self.Zoom(_self.zoomOptions.In);
        });
    }

    SetZoomOutEvent() {
        let _self = this;
        document.getElementById("btn_zoom_minus").addEventListener('click', function(event){
            _self.Zoom(_self.zoomOptions.Out);
        });
    }

    Zoom(zoomOption) {
        let minZoom = this.placeteam.minZoomPercentageMobile;
        if (this.placeteam.desktopMediaQuery.matches) {
            minZoom = this.placeteam.minZoomPercentageDesktop;
        } else if (this.placeteam.tabletMediaQuery.matches) {
            minZoom = this.placeteam.minZoomPercentageTablet;
        }
        let newCanvasWidth;
        switch(zoomOption) {
            case this.zoomOptions.In:
                newCanvasWidth = this.canvasManipulator.GetCanvasWidthPercentageInt() * this.placeteam.zoomSpeed;
            case this.zoomOptions.Out:
                newCanvasWidth = this.canvasManipulator.GetCanvasWidthPercentageInt() / this.placeteam.zoomSpeed;
        }
        let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
        normalizedCanvasWidth = Math.min(this.placeteam.maxZoom, normalizedCanvasWidth);
        this.navigation.SetZoom(normalizedCanvasWidth);
    }

    SetSliderEvent() {
        let _self = this;
        this.placeteam.rangezoom.addEventListener('input', function(event){
            //console.log(event);
            _self.navigation.SetZoom(_self.placeteam.rangezoom.value);
        });
    }

    SetFullscreenEvent() {
        let _self = this;
        document.getElementById("btn_fullscreen").addEventListener('click', function(event){
            if(!_self.placeteam.fullscreen){
                document.documentElement.requestFullscreen();
            }
            else{
                document.exitFullscreen();
            }
        });
    }
}