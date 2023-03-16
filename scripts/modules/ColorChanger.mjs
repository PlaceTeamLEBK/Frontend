export class ColorChanger {
    placeteam = null;
    colorStorage = null;

    constructor(placeteam, colorStorage) {
        this.placeteam = placeteam;
        this.colorStorage = colorStorage;
    }

    SetEvents() {
        this.SetInputChangeEvents();
        this.SetClickEvents();
        this.SetEditModeButtonClickEvent();
    }

    SetInputChangeEvents() {
        let _self = this;
        this.placeteam.colorcontainer.querySelectorAll('.edit input').forEach((element, index) => {
            element.addEventListener('change', function(event){
                _self.ChangeColor(element.value, element.dataset.colorid);
            });
        });
    }

    SetClickEvents() {
        let _self = this;
        this.placeteam.colorcontainer.querySelectorAll('.select>div').forEach((newselectelement) => {
            newselectelement.addEventListener('click', function(event){
                _self.placeteam.colorcontainer.querySelectorAll('.select>div').forEach((element)=>{
                    element.classList.remove('selected')
                })
                newselectelement.classList.add('selected');
            });
        });
    }

    SetEditModeButtonClickEvent() {
        let _self = this;
        this.placeteam.editcolorbutton.addEventListener('click', function(event){
            _self.placeteam.colorcontainer.querySelector('div.edit').classList.toggle('hidden');
            _self.placeteam.colorcontainer.querySelector('div.select').classList.toggle('hidden');
        });
    }

    ChangeColor(color, id) {
        let selectelement = this.placeteam.colorcontainer.querySelector('.select>div[data-colorid="'+id+'"]');
        selectelement.style.backgroundColor = color;
        placeteam.colors[id] = color;
        this.colorStorage.SaveColor();
    }
}