export class Intro {
    placeteam = null;

    constructor(placeteam) {
        this.placeteam = placeteam;
    }
    startIntro() {
        if(localStorage.getItem("intro_played")=="false"){
            localStorage.setItem("intro_played", "true");
            document.querySelector('#statuscontainer').classList.toggle("hidden");
            introJs().setOptions({
                steps: [{
                  title: 'Willkommen auf placeteam.art',
                  intro: 'Es handelt sich um ein experimentelles Unterfangen mit mehreren Probanden, die kollaborativ an der Erschaffung eines monumentalen Kunstwerks beteiligt sind.'
                },
                {
                  title: 'Das ist der Timer.',
                  element: document.querySelector('#statuscontainer'),
                  intro: 'In Zeitabständen von jeweils einer Minute kann ein einzelnes Pixel platziert werden. Sobald ein Pixel platziert wurde, tritt ein Abklingzeitraum in Kraft, während dessen keine weiteren Pixel gesetzt werden können. Erst nach Ablauf des Abklingzeitraums ist es wieder möglich, ein Pixel zu setzen.'
                },
                {
                  title: 'Farbpalette',
                  element: document.querySelector('#colorcontainer'),
                  intro: 'Dies ist die Palette mit verschiedenen Farbtönen, aus der ausgewählt werden kann, um damit zu malen.'
                },
                {
                  title: 'Farbumstellung',
                  element: document.querySelector('#editcolorbutton'),
                  intro: 'Mittels des Bearbeitungssymbols ist es möglich, die vordefinierten Farben individuell anzupassen. Um dies zu tun, muss das Bearbeitungssymbol angeklickt werden, der betreffende Farbslot ausgewählt werden und die Änderungen werden durch erneutes Klicken auf das Bearbeitungssymbol gespeichert.'
                },
                {
                  title: 'Abschluss',
                  intro: 'Danke für die Verwendung von placeteam.art und Viel Spaß!'
                }]
              }).start();
        }
    }
}