import View from './View';

/**
 * Border view. Can be used to render CSS-like border. Border can be applied to any
 * zebkit UI component by calling setBorder method:

        // create label component
        var lab = new zebkit.ui.Label("Test label");

        // set red border to the label component
        lab.setBorder(new zebkit.ui.Border("red"));

 * @param  {String}  [c] border color
 * @param  {Integer} [w] border width
 * @param  {Integer} [r] border corners radius
 * @constructor
 * @class zebkit.ui.Border
 * @extends zebkit.ui.View
 */

export default class Border extends View {
    color: string;
    gap: number;
    radius: number;
    sides: number;
    width: number;

    constructor(c,w,r) {
        /**
         * Border color
         * @attribute color
         * @readOnly
         * @type {String}
         * @default "gray"
         */

        /**
         * Border line width
         * @attribute width
         * @readOnly
         * @type {Integer}
         * @default 1
         */

        /**
         * Border radius
         * @attribute radius
         * @readOnly
         * @type {Integer}
         * @default 0
         */

        super();

        this.color  = "gray";
        this.gap    = this.width = 1;
        this.radius = 0;

        // TODO: use default args
        if (arguments.length > 0) this.color = c;
        if (arguments.length > 1) this.width = this.gap = w;
        if (arguments.length > 2) this.radius = r;        
    }

    setSides(top:number, left:number, bottom:number, right:number) {
        this.sides = 0;
        for(var i = 0; i < arguments.length; i++) {
            if (arguments[i] === "top") this.sides  |= 1;
            else if (arguments[i] === "left"  ) this.sides  |= 2;
            else if (arguments[i] === "bottom") this.sides  |= 4;
            else if (arguments[i] === "right" ) this.sides  |= 8;
        }

        return this;
    }

    paint(g, x:number,y:number,w:number,h:number,d:number) {
        if (this.color !== null && this.width > 0) {
            var ps = g.lineWidth;

            if (g.lineWidth !== this.width) {
                g.lineWidth = this.width;
            }

            if (this.radius > 0) {
                this.outline(g,x,y,w,h, d);
            } else {
                if (typeof this.sides !== "undefined" && this.sides !== 15) {
                    g.setColor(this.color);
                    // top
                    if ((this.sides & 1) > 0) {
                        g.drawLine(x, y, x + w, y, this.width);
                    }

                    // right
                    if ((this.sides & 8) > 0) {
                        g.drawLine(x + w - this.width, y, x + w - this.width, y + h, this.width);
                    }

                    // bottom
                    if ((this.sides & 4) > 0) {
                        g.drawLine(x, y + h - this.width, x + w, y + h - this.width, this.width);
                    }

                    // left
                    if ((this.sides & 2) > 0) {
                            g.drawLine(x, y, x, y + h, this.width);
                    }

                    // TODO: dangerouse return
                    return;
                } else  {
                    var dt = this.width / 2;
                    g.beginPath();
                    g.rect(x + dt, y + dt, w - this.width, h - this.width);
                    g.closePath();
                }
            }

            g.setColor(this.color);
            g.stroke();

            if (g.lineWidth !== ps) g.lineWidth = ps;
        }
    }

    /**
     * Defines border outline for the given 2D Canvas context
     * @param  {2D Canvas context} g
     * @param  {Integer} x x coordinate
     * @param  {Integer} y y coordinate
     * @param  {Integer} w required width
     * @param  {Integer} h required height
     * @param  {Integer} d target UI component
     * @method outline
     * @return {Boolean} true if the outline has to be applied as an
     * UI component shape
     */
    outline(g,x,y,w,h,d) {
        if (this.radius <= 0) {
            return false;
        }

        var r  = this.radius,
            dt = this.width / 2,
            xx = x + w - dt,
            yy = y + h - dt;

        x += dt;
        y += dt;

        // !!! this code can work improperly in IE 10 in Vista !
        // g.beginPath();
        // g.moveTo(x+r, y);
        // g.arcTo(xx, y, xx, yy, r);
        // g.arcTo(xx, yy, x, yy, r);
        // g.arcTo(x, yy, x, y, r);
        // g.arcTo(x, y, xx, y, r);
        // g.closePath();
        // return true;

        g.beginPath();
        g.moveTo(x + r, y);
        g.lineTo(xx - r, y);
        g.quadraticCurveTo(xx, y, xx, y + r);
        g.lineTo(xx, yy  - r);
        g.quadraticCurveTo(xx, yy, xx - r, yy);
        g.lineTo(x + r, yy);
        g.quadraticCurveTo(x, yy, x, yy - r);
        g.lineTo(x, y + r);
        g.quadraticCurveTo(x, y, x + r, y);
        g.closePath();
        return true;
    }
}