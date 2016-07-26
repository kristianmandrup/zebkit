/**
 * Tooltip UI component. The component can be used as a tooltip that
 * shows specified content in figured border.
 * @class  zebkit.ui.Tooltip
 * @param  {zebkit.util.Panel|String} a content component or test label to be shown in tooltip
 * @constructor
 * @extends {zebkit.ui.Panel}
 */

import View from '../views/View';

class TooltipBorder extends View {
    color: string;
    size: number;

    constructor(col, size) {
        super();
        this.color = "black";
        this.size = 2;

        if (arguments.length > 0) this.color = col;
        if (arguments.length > 1) this.size  = size;
        this.gap = 2 * this.size;

    }

    paint(g,x,y,w,h,d) {
        if (this.color != null) {
            this.outline(g,x,y,w,h,d);
            g.setColor(this.color);
            g.lineWidth = this.size;
            g.stroke();
        }
    };

    outline(g,x,y,w,h,d) {
        g.beginPath();
        h -= 2 * this.size;
        w -= 2 * this.size;
        x += this.size;
        y += this.size;

        var w2   = (w/2 + 0.5) | 0,
            h3   = (h/3 + 0.5) | 0,
            w3_8 = ((3 * w)/8 + 0.5) | 0,
            h2_3 = ((2 * h)/3 + 0.5) | 0,
            h3   = (h/3 + 0.5) | 0,
            w4   = (w/4 + 0.5) | 0;

        g.moveTo(x + w2, y);
        g.quadraticCurveTo(x, y, x, y + h3);
        g.quadraticCurveTo(x, y + h2_3, x + w4,  y + h2_3);
        g.quadraticCurveTo(x + w4, y + h, x, y + h);
        g.quadraticCurveTo(x + w3_8, y + h, x + w2, y + h2_3);
        g.quadraticCurveTo(x + w, y + h2_3, x + w, y + h3);
        g.quadraticCurveTo(x + w, y, x + w2, y);
        g.closePath();
        return true;
    }
}

import {Label, ImageLabel} from '../';
import Panel from '../core/Panel';

function Clazz() {
        this.Label = Label;

        this.ImageLabel = ImageLabel;

        this.TooltipBorder = TooltipBorder; 
}


export default class Tooltip extends Panel {
    $clazz() {
      return new Clazz();
    }

    constructor(content) {
        super();
        this.add(pkg.$component(content, this));
        this.toPreferredSize();
    }

    // static

    setColor() {
        // TODO: BUG, stack oeverflow
        this.properties("//*", {
            color: arguments
        });
        return this;
    }

    setFont() {
        // TODO: BUG, stack oeverflow
        this.properties("//*", {
            font: arguments
        });
        return this;
    }

    recalc() {
        this.$contentPs = (this.kids.length === 0 ? super.recalc()
                                                  : this.kids[0].getPreferredSize());
    }

    getBottom() {
        return super.getBottom() + this.$contentPs.height;
    }

    getTop() {
        return super.getTop() + ((this.$contentPs.height/6 + 0.5) | 0);
    }

    getLeft() {
        return super.getLeft() + ((this.$contentPs.height/6 + 0.5) | 0);
    }

    getRight() {
        return super.getRight() + ((this.$contentPs.height/6 + 0.5) | 0);
    }
}