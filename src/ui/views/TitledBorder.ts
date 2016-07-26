import Render from './Render';
import { $validateValue } from '../../utils/validate';

/**
 * Render class that allows developers to render a border with a title area.
 * The title area has to be specified by an UI component that uses the border
 * by defining "getTitleInfo()"" method. The method has to return object that
 * describes title size, location and alignment:
 *
 *
 *      {
 *        x: {Integer}, y: {Integer},
 *        width: {Integer}, height: {Integer},
 *        orient: {Integer}
 *      }
 *
 *
 * @class zebkit.ui.TitledBorder
 * @extends zebkit.ui.Render
 * @constructor
 * @param {zebkit.ui.View} border  a border to be rendered with a title area
 * @param {String} [lineAlignment] a line alignment. Specifies how
 * a title area has to be aligned relatively border line:
 *
 *       "bottom"  - title area will be placed on top of border line:
 *                    ___| Title area |___
 *
 *
 *      "center"   - title area will be centered relatively to border line:
 *                    ---| Title area |-----
 *
 *
 *      "top"      - title area will be placed underneath of border line:
 *                     ____              ________
 *                         |  Title area |
 *
 */
export default class TitledBorder extends Render {
    lineAlignment: string;
    
    constructor(b, a){
        super(b);
        if (arguments.length > 1) {
            this.lineAlignment = $validateValue(a, "bottom", "top", "center");
        }
        this.setTarget(b);

        this.lineAlignment = "bottom";
    }

    getTop(){
        return this.target.getTop();
    };

    getLeft (){
        return this.target.getLeft();
    };

    getRight (){
        return this.target.getRight();
    };

    getBottom (){
        return this.target.getBottom();
    };

    outline (g,x,y,w,h,d) {
        var xx = x + w, yy = y + h;
        if (d.getTitleInfo != null) {
            var r = d.getTitleInfo();
            if (r != null) {
                switch(r.orient) {
                    case "bottom":
                        var bottom = this.target.getBottom();
                        switch (this.lineAlignment) {
                            case "center" : yy = r.y + Math.floor((r.height - bottom)/ 2) + bottom; break;
                            case "top"    : yy = r.y + r.height + bottom; break;
                            case "bottom" : yy = r.y; break;
                        }
                        break;
                    case "top":
                        var top = this.target.getTop();
                        switch (this.lineAlignment) {
                            case "center" : y = r.y + Math.floor((r.height - top)/2);   break; // y = r.y + Math.floor(r.height/ 2) ; break;
                            case "top"    : y = r.y - top; break;
                            case "bottom" : y = r.y + r.height; break;
                        }
                        break;
                    case "left":
                        var left = this.target.getLeft();
                        switch (this.lineAlignment) {
                            case "center" : x = r.x + Math.floor((r.width - left) / 2); break;
                            case "top"    : x = r.x - left; break;
                            case "bottom" : x = r.x + r.width; break;
                        }
                        break;
                    case "right":
                        var right = this.target.getRight();
                        switch (this.lineAlignment) {
                            case "center" : xx = r.x + Math.floor((r.width - right) / 2) + right; break;
                            case "top"    : xx = r.x + r.width + right; break;
                            case "bottom" : xx = r.x; break;
                        }
                        break;
                }
            }
        }

        if (this.target != null && this.target.outline != null) {
            var b = this.target.outline(g, x, y, xx - x, yy - y, d);
            if (b === true) return b;
        }

        g.beginPath();
        g.rect(x, y, xx - x, yy - y);
        g.closePath();
        return true;
    }

    $isIn(clip, x, y, w, h) {
        var rx = clip.x > x ? clip.x : x,
            ry = clip.y > y ? clip.y : y,
            rw = Math.min(clip.x + clip.width, x + w) - rx,
            rh = Math.min(clip.y + clip.height, y + h) - ry;
        return (clip.x === rx && clip.y === ry && clip.width === rw && clip.height === rh);
    }

    paint(g,x,y,w,h,d){
        if (d.getTitleInfo != null){
            var r = d.getTitleInfo();
            if (r != null) {
                var xx = x + w, yy = y + h, t = g.$states[g.$curState];
                switch (r.orient) {
                    case "top":
                        var top = this.target.getTop();
                        // compute border y
                        switch (this.lineAlignment) {
                            case "center" : y = r.y + Math.floor((r.height - top) / 2) ; break;
                            case "top"    : y = r.y - top; break;
                            case "bottom" : y = r.y + r.height; break;
                        }

                        // skip rendering border if the border is not in clip rectangle
                        // This is workaround because of IE10/IE11 have bug what causes
                        // handling rectangular clip + none-rectangular clip side effect
                        // to "fill()" subsequent in proper working (fill without respect of
                        // clipping  area)
                        if (this.$isIn(t, x + this.target.getLeft(), y,
                                        w - this.target.getRight() - this.target.getLeft(),
                                        yy - y - this.target.getBottom()))
                        {
                            return;
                        }

                        g.save();
                        g.beginPath();

                        g.moveTo(x, y);
                        g.lineTo(r.x, y);
                        g.lineTo(r.x, y + top);
                        g.lineTo(r.x + r.width, y + top);
                        g.lineTo(r.x + r.width, y);
                        g.lineTo(xx, y);
                        g.lineTo(xx, yy);
                        g.lineTo(x, yy);
                        g.lineTo(x, y);

                        break;
                    case "bottom":
                        var bottom = this.target.getBottom();
                        switch (this.lineAlignment) {
                            case "center" : yy = r.y + Math.floor((r.height - bottom) / 2) + bottom; break;
                            case "top"    : yy = r.y + r.height + bottom; break;
                            case "bottom" : yy = r.y ; break;
                        }

                        if (this.$isIn(t, x + this.target.getLeft(), y + this.target.getTop(),
                                          w - this.target.getRight() - this.target.getLeft(),
                                          yy - y - this.target.getTop()))
                        {
                            return;
                        }

                        g.save();
                        g.beginPath();

                        g.moveTo(x, y);
                        g.lineTo(xx, y);
                        g.lineTo(xx, yy);
                        g.lineTo(r.x + r.width, yy);
                        g.lineTo(r.x + r.width, yy - bottom);
                        g.lineTo(r.x, yy - bottom);
                        g.lineTo(r.x, yy);
                        g.lineTo(x, yy);
                        g.lineTo(x, y);

                        break;
                    case "left":
                        var left = this.target.getLeft();
                        switch (this.lineAlignment) {
                            case "center" : x = r.x + Math.floor((r.width - left) / 2); break;
                            case "top"    : x = r.x  - left; break;
                            case "bottom" : x = r.x + r.width; break;
                        }

                        if (this.$isIn(t, x, y + this.target.getTop(),
                                        xx - x - this.target.getRight(),
                                        h - this.target.getTop() - this.target.getBottom()))
                        {
                            return;
                        }

                        g.save();
                        g.beginPath();

                        g.moveTo(x, y);
                        g.lineTo(xx, y);
                        g.lineTo(xx, yy);
                        g.lineTo(x, yy);
                        g.lineTo(x, r.y + r.height);
                        g.lineTo(x + left, r.y + r.height);
                        g.lineTo(x + left, r.y);
                        g.lineTo(x, r.y);
                        g.lineTo(x, y);

                        break;
                    case "right":
                        var right = this.target.getRight();
                        switch (this.lineAlignment) {
                            case "center" : xx = r.x + Math.floor((r.width - right) / 2) + right; break;
                            case "top"    : xx = r.x  + r.width + right; break;
                            case "bottom" : xx = r.x; break;
                        }

                        if (this.$isIn(t, x + this.target.getLeft(),
                                          y + this.target.getTop(),
                                          xx - x - this.target.getLeft(),
                                          h - this.target.getTop() - this.target.getBottom()))
                        {
                            return;
                        }

                        g.save();
                        g.beginPath();

                        g.moveTo(x, y);
                        g.lineTo(xx, y);
                        g.lineTo(xx, r.y);
                        g.lineTo(xx - right, r.y);
                        g.lineTo(xx - right, r.y + r.height);
                        g.lineTo(xx, r.y + r.height);
                        g.lineTo(xx, yy);
                        g.lineTo(x, yy);
                        g.lineTo(x, y);
                        break;
                    // throw error to avoid wrongly called restore method below
                    default: throw new Error("Invalid title orientation " + r.orient);
                }

                g.closePath();
                g.clip();
                this.target.paint(g, x, y, xx - x, yy - y, d);
                g.restore();
            }
        }
        else {
            this.target.paint(g, x, y, w, h, d);
        }
    }
}