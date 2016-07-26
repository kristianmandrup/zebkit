/**
* Sunken border view
* @class zebkit.ui.Sunken
* @constructor
* @param {String} [brightest] a brightest border line color
* @param {String} [moddle] a middle border line color
* @param {String} [darkest] a darkest border line color
* @extends zebkit.ui.View
*/
import View from './View';

class Sunken extends View {
    constructor(public brightest : string, public middle : string, public darkest : string) {
        super();

        /**
         * Brightest border line color
         * @attribute brightest
         * @readOnly
         * @type {String}
         * @default "white"
         */

        /**
         * Middle border line color
         * @attribute middle
         * @readOnly
         * @type {String}
         * @default "gray"
         */

        /**
         * Darkest border line color
         * @attribute darkest
         * @readOnly
         * @type {String}
         * @default "black"
         */
        this.brightest = "white";
        this.middle    = "gray" ;
        this.darkest   = "black";
        if (arguments.length > 0) this.brightest = brightest;
        if (arguments.length > 1) this.middle    = middle;
        if (arguments.length > 2) this.darkest   = darkest;
    }


    paint(g,x1,y1,w,h,d){
        var x2 = x1 + w - 1, y2 = y1 + h - 1;
        g.setColor(this.middle);
        g.drawLine(x1, y1, x2 - 1, y1);
        g.drawLine(x1, y1, x1, y2 - 1);
        g.setColor(this.brightest);
        g.drawLine(x2, y1, x2, y2 + 1);
        g.drawLine(x1, y2, x2, y2);
        g.setColor(this.darkest);
        g.drawLine(x1 + 1, y1 + 1, x1 + 1, y2);
        g.drawLine(x1 + 1, y1 + 1, x2, y1 + 1);
    }
}