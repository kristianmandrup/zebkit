/**
* Raised border view
* @class zebkit.ui.Raised
* @param {String} [brightest] a brightest border line color
* @param {String} [middle] a middle border line color
* @constructor
* @extends zebkit.ui.View
*/
import View from './View';

class Raised extends View {
    constructor(public brightest: string = 'white', public middle: string = 'gray') {
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

        if (arguments.length > 0) this.brightest = brightest;
        if (arguments.length > 1) this.middle    = middle;
    }

    paint(g,x1,y1,w,h,d){
        var x2 = x1 + w - 1, y2 = y1 + h - 1;
        g.setColor(this.brightest);
        g.drawLine(x1, y1, x2, y1);
        g.drawLine(x1, y1, x1, y2);
        g.setColor(this.middle);
        g.drawLine(x2, y1, x2, y2 + 1);
        g.drawLine(x1, y2, x2, y2);
    }
}