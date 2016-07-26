import View from './View';
/**
* Dotted border view
* @class zebkit.ui.Dotted
* @param {String} [c] the dotted border color
* @constructor
* @extends zebkit.ui.View
*/
export default class Dotted extends View {
    color: string;

    constructor(c){            
        super();
        /**
         * @attribute color
         * @readOnly
         * @type {String}
         * @default "black"
         */
        this.color = "black";
        if (arguments.length > 0) this.color = c;
    }
    
    paint(g ,x:number,y:number,w:number,h:number,d:number) {
        g.setColor(this.color);
        g.drawDottedRect(x, y, w, h);
    }
}