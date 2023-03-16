export class ColorStorage {
    placeteam = null;

    constructor(placeteam) {
        this.placeteam = placeteam;
    }

    LoadColors() {
        let localcolors = localStorage.getItem("colors");
        if(localcolors != null)
        this.placeteam.colors=JSON.parse(localcolors);
        //load from sessionstorage eventually;
        this.placeteam.colors.forEach((color, index)=>{
            this.placeteam.colorcontainer.querySelector('input[data-colorid="'+index+'"]').value=color;
            this.placeteam.colorcontainer.querySelector('div[data-colorid="'+index+'"]').style.backgroundColor=color;
        });
    }

    SaveColors() {
        localStorage.setItem("colors", JSON.stringify(this.placeteam.colors));
    }
}