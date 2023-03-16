export class ZoomSlider {
    placeteam = null;
    navigation = null;
    canvasManipulator = null;

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
            let minZoom = _self.placeteam.minZoomPercentageMobile;
            if (_self.placeteam.desktopMediaQuery.matches) {
                minZoom = _self.placeteam.minZoomPercentageDesktop;
            } else if (_self.placeteam.tabletMediaQuery.matches) {
                minZoom = _self.placeteam.minZoomPercentageTablet;
            }
            let newCanvasWidth = _self.canvasManipulator.GetCanvasWidthPercentageInt() * _self.placeteam.zoomSpeed;
            let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
            normalizedCanvasWidth = Math.min(_self.placeteam.maxZoom, normalizedCanvasWidth);
            _self.navigation.SetZoom(normalizedCanvasWidth);
        });
    }

    SetZoomOutEvent() {
        let _self = this;
        document.getElementById("btn_zoom_minus").addEventListener('click', function(event){
            let minZoom = _self.placeteam.minZoomPercentageMobile;
            if (_self.placeteam.desktopMediaQuery.matches) {
                minZoom = _self.placeteam.minZoomPercentageDesktop;
            } else if (_self.placeteam.tabletMediaQuery.matches) {
                minZoom = _self.placeteam.minZoomPercentageTablet;
            }
            let newCanvasWidth = _self.canvasManipulator.GetCanvasWidthPercentageInt() / _self.placeteam.zoomSpeed;
            let normalizedCanvasWidth = Math.max(minZoom, newCanvasWidth);
            normalizedCanvasWidth = Math.min(_self.placeteam.maxZoom, normalizedCanvasWidth);
            _self.navigation.SetZoom(normalizedCanvasWidth);
        });
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