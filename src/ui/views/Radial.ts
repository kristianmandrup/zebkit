/**
* Radial gradient view
* @param {String} startColor a start color
* @param {String} stopColor a stop color
* @constructor
* @class zebkit.ui.Radial
* @extends zebkit.ui.View
*/
import View from './View';

export default class Radial extends View {
    colors: string[];
    gradient: any;

    constructor() {
        super();
        this.colors = Array.prototype.slice.call(arguments, 0);
    }

    paint(g,x,y,w,h,d){
        var cx1 = Math.floor(w / 2), cy1 = Math.floor(h / 2);
        this.gradient = g.createRadialGradient(cx1, cy1, 10, cx1, cy1, w > h ? w : h);

        for(var i=0; i < this.colors.length;i++) {
            this.gradient.addColorStop(i, this.colors[i].toString());
        }
        g.fillStyle = this.gradient;
        g.fillRect(x, y, w, h);
    }
}
