/**
 * RGB color class. This class represents rgb(a) color as JavaScript structure:

       // rgb color
       var rgb1 = new zebkit.util.rgb(100,200,100);

       // rgb with transparency
       var rgb2 = new zebkit.util.rgb(100,200,100, 0.6);

       // encoded as a string rgb color
       var rgb3 = new zebkit.util.rgb("rgb(100,100,200)");

       // hex rgb color
       var rgb3 = new zebkit.util.rgb("#CCDDFF");

 * @param  {Integer|String} r  red color intensity or if this is the only constructor parameter it denotes
 * encoded in string rgb color
 * @param  {Integer} [g]  green color intensity
 * @param  {Integer} [b] blue color intensity
 * @param  {Float}   [a] alpha color intensity
 * @constructor
 * @class zebkit.util.rgb
 */
export const Rgb = function (r, g?, b?, a?) {
    /**
     * Red color intensity
     * @attribute r
     * @type {Integer}
     * @readOnly
     */

    /**
     * Green color intensity
     * @attribute g
     * @type {Integer}
     * @readOnly
     */

    /**
     * Blue color intensity
     * @attribute b
     * @type {Integer}
     * @readOnly
     */

    /**
     * Alpha
     * @attribute a
     * @type {Float}
     * @readOnly
     */

    /**
     * Indicates if the color is opaque
     * @attribute isOpaque
     * @readOnly
     * @type {Boolean}
     */
    this.isOpaque = true;

    if (arguments.length == 1) {
        if (zebkit.isString(r)) {
            this.s = r;
            if (r[0] === '#') {
                r = parseInt(r.substring(1), 16);
            }
            else {
                if (r[0] === 'r' && r[1] === 'g' && r[2] === 'b') {
                    var i = r.indexOf('(', 3), p = r.substring(i + 1, r.indexOf(')', i + 1)).split(",");
                    this.r = parseInt(p[0].trim(), 10);
                    this.g = parseInt(p[1].trim(), 10);
                    this.b = parseInt(p[2].trim(), 10);
                    if (p.length > 3) {
                        this.a = parseInt(p[3].trim(), 10);
                        this.isOpaque = (this.a === 1);
                    }
                    return;
                }
            }
        }
        this.r =  r >> 16;
        this.g = (r >> 8) & 0xFF;
        this.b = (r & 0xFF);
    }
    else {
        this.r = r;
        this.g = g;
        this.b = b;
        if (arguments.length > 3) this.a = a;
    }

    if (this.s == null) {
        this.s = (typeof this.a !== "undefined") ? 'rgba(' + this.r + "," + this.g +  "," +
                                                             this.b + "," + this.a + ")"
                                                 : '#' +
                                                   ((this.r < 16) ? "0" + this.r.toString(16) : this.r.toString(16)) +
                                                   ((this.g < 16) ? "0" + this.g.toString(16) : this.g.toString(16)) +
                                                   ((this.b < 16) ? "0" + this.b.toString(16) : this.b.toString(16));
    }
};

Rgb.prototype.toString = function() {
    return this.s;
};

export const rgb = {
  black:       new Rgb(0),
  white:       new Rgb(0xFFFFFF),
  red:         new Rgb(255,0,0),
  blue:        new Rgb(0,0,255),
  green:       new Rgb(0,255,0),
  gray:        new Rgb(128,128,128),
  lightGray:   new Rgb(211,211,211),
  darkGray:    new Rgb(169,169,169),
  orange:      new Rgb(255,165,0),
  yellow:      new Rgb(255,255,0),
  pink:        new Rgb(255,192,203),
  cyan:        new Rgb(0,255,255),
  magenta:     new Rgb(255,0,255),
  darkBlue:    new Rgb(0, 0, 140),
  transparent: new Rgb(0, 0, 0, 0.0)
};
  


