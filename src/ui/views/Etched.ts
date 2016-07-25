import View from './View';

/**
* Etched border view
* @class zebkit.ui.Etched
* @constructor
* @param {String} [brightest] a brightest border line color
* @param {String} [moddle] a middle border line color
* @extends zebkit.ui.View
*/
class Etched extends View {
    brightest: string;
    middle: string;    

    constructor(brightest, middle) {
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

        super();
        this.brightest = "white";
        this.middle    = "gray" ;

        if (arguments.length > 0) this.brightest = brightest;
        if (arguments.length > 1) this.middle    = middle;
    }

    paint(g,x1,y1,w,h,d){
        var x2 = x1 + w - 1, y2 = y1 + h - 1;
        g.setColor(this.middle);
        g.drawLine(x1, y1, x1, y2 - 1);
        g.drawLine(x2 - 1, y1, x2 - 1, y2);
        g.drawLine(x1, y1, x2, y1);
        g.drawLine(x1, y2 - 1, x2 - 1, y2 - 1);

        g.setColor(this.brightest);
        g.drawLine(x2, y1, x2, y2);
        g.drawLine(x1 + 1, y1 + 1, x1 + 1, y2 - 1);
        g.drawLine(x1 + 1, y1 + 1, x2 - 1, y1 + 1);
        g.drawLine(x1, y2, x2 + 1, y2);
    }
}