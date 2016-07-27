/**
* Image render. Render an image target object or specified area of
* the given target image object.
* @param {Image} img the image to be rendered
* @param {Integer} [x] a x coordinate of the rendered image part
* @param {Integer} [y] a y coordinate of the rendered image part
* @param {Integer} [w] a width of the rendered image part
* @param {Integer} [h] a height of the rendered image part
* @constructor
* @class zebkit.ui.Picture
* @extends zebkit.ui.Render
*/
import Render from './Render';

export default class Picture extends Render {
    constructor(img, public x? : number, public y? : number, public width? : number, public height? : number) {
        super();
        /**
         * A x coordinate of the image part that has to be rendered
         * @attribute x
         * @readOnly
         * @type {Integer}
         * @default 0
         */

        /**
         * A y coordinate of the image part that has to be rendered
         * @attribute y
         * @readOnly
         * @type {Integer}
         * @default 0
         */

        /**
         * A width  of the image part that has to be rendered
         * @attribute width
         * @readOnly
         * @type {Integer}
         * @default 0
         */

        /**
         * A height  of the image part that has to be rendered
         * @attribute height
         * @readOnly
         * @type {Integer}
         * @default 0
         */

        this.setTarget(img);
        if (arguments.length > 4) {
            this.x = x;
            this.y = y;
            this.width  = width;
            this.height = height;
        }
        else {
            this.x = this.y = this.width = this.height = 0;
        }
    }

    paint(g,x,y,w,h,d) {
        if (this.target != null && this.target.complete === true && this.target.naturalWidth > 0 && w > 0 && h > 0){
            if (this.width > 0) {
                g.drawImage(this.target, this.x, this.y,
                            this.width, this.height, x, y, w, h);
            }
            else {
                g.drawImage(this.target, x, y, w, h);
            }
        }
    }

    getPreferredSize() {
        var img = this.target;
        return (img == null ||
                img.naturalWidth <= 0 ||
                img.complete !== true) ? { width:0, height:0 }
                                        : (this.width > 0) ? { width:this.width, height:this.height }
                                                            : { width:img.width, height:img.height };
    }
}

