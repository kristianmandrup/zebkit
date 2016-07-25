
/**
 * Line UI component class. Draw series of vertical or horizontal lines of using
 * the given line width and color. Vertical or horizontal line rendering s selected
 * depending on the line component size: if height is greater than width than vertical
 * line will be rendered.
 * @constructor
 * @class zebkit.ui.Line
 * @extends {zebkit.ui.Panel}
 */
import Panel from './Panel';

export default class Line extends Panel {
    constructor() {
        super();
        this.colors = [ "gray" ];

        /**
         * Line width
         * @attribute lineWidth
         * @type {Integer}
         * @default 1
         */
        this.lineWidth = 1;

        /**
         * Line colors
         * @attribute colors
         * @type {Array}
         * @readOnly
         * @default [ "gray" ]
         */

        if (arguments.length > 0) {
            this.setColors.apply(this, arguments);
        }        
    }

    setColor(c) {
        this.setColors(c);
        return this;
    }

    /**
     * Set set of colors to be used to paint the line. Number of colors defines the number of
     * lines to be painted.
     * @param {String} colors* colors
     * @method setLineColors
     */
    setColors() {
        this.colors = (arguments.length === 1) ? (Array.isArray(arguments[0]) ? arguments[0].slice(0)
                                                                              : [ arguments[0] ] )
                                                : Array.prototype.slice.call(arguments);
        this.repaint();
        return this;
    }

    paint(g) {
        var isHor  = this.width > this.height,
            left   = this.getLeft(),
            right  = this.getRight(),
            top    = this.getTop(),
            bottom = this.getBottom(),
            xy     = isHor ? top : left;

        for(var i = 0; i < this.colors.length; i++) {
            if (this.colors[i] != null) {
                g.setColor(this.colors[i]);
                if (isHor === true) {
                    g.drawLine(this.left, xy, this.width - right - left, xy, this.lineWidth);
                }
                else {
                    g.drawLine(xy, top, xy, this.height - top - bottom, this.lineWidth);
                }
            }
            xy += this.lineWidth;
        }
    }

    calcPreferredSize(target) {
        var s = this.colors.length * this.lineWidth;
        return { width: s, height:s};
    }
}
