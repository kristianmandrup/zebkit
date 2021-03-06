import { types } from '../../utils';
import View from './View';

/**
 * Round border view.
 * @param  {String}  [col] border color. Use null as the
 * border color value to prevent painting of the border
 * @param  {Integer} [width] border width
 * @constructor
 * @class zebkit.ui.RoundBorder
 * @extends zebkit.ui.View
 */
export default class RoundBorder extends View {
    lineWidth: number;

    constructor(public color : number, public width : number) {
        super();
        /**
         * Border width
         * @attribute width
         * @readOnly
         * @type {Integer}
         * @default 1
         */
        this.width = 1;

        /**
         * Border color
         * @attribute color
         * @readOnly
         * @type {String}
         * @default null
         */
        this.color = null;


        if (arguments.length > 0) {
            if (types.isNumber(color)) this.width = color;
            else {
                this.color = color;
                if (types.isNumber(width)) this.width = width;
            }
        }
        this.gap = this.width;
    }

    paint(g,x,y,w,h,d) {
        if (this.color != null && this.width > 0) {
            this.outline(g,x,y,w,h,d);
            g.setColor(this.color);
            g.stroke();
        }
    }

    outline(g,x,y,w,h,d) {
        g.lineWidth = this.width;
        if (w === h) {
            g.beginPath();
            g.arc(Math.floor(x + w / 2) + (w % 2 === 0 ? 0 :0.5),
                    Math.floor(y + h / 2) + (h % 2 === 0 ? 0 :0.5),
                    Math.floor((w - g.lineWidth)/2), 0, 2 * Math.PI, false);
            g.closePath();
        } else {
            g.ovalPath(x,y,w,h);
        }
        return true;
    }

    getPreferredSize() {
        var s = this.lineWidth * 8;
        return  {
            width : s, height : s
        };
    }        
}
