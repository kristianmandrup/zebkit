import Canvas from 'canvas';
import View from './View';

/**
 * The radio button ticker view.
 * @class  zebkit.ui.RadioView
 * @extends zebkit.ui.View
 * @constructor
 * @param {String} [col1] color one to render the outer cycle
 * @param {String} [col2] color tow to render the inner cycle
 */
export default class RadioView extends View {
    color1: string;
    color2: string;

    constructor(col1, col2) {
        super();
        this.color1 = "rgb(15, 81, 205)";
        this.color2 = "rgb(65, 131, 255)";

        if (arguments.length > 0) {
            this.color1 = col1
            if (arguments.length > 1) {
                this.color2 = col2;
            }
        };
    }

    paint(g: Canvas ,x:number,y:number,w:number,h:number,d:number) {
        g.beginPath();

        g.fillStyle = this.color1;
        g.arc(Math.floor(x + w/2), Math.floor(y + h/2) , Math.floor(w/3 - 0.5), 0, 2* Math.PI, 1, false);
        g.fill();

        g.beginPath();
        g.fillStyle = this.color2;
        g.arc(Math.floor(x + w/2), Math.floor(y + h/2) , Math.floor(w/4 - 0.5), 0, 2* Math.PI, 1, false);
        g.fill();
    }
}
