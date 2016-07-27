/**
 * This class represents a font and provides basic font metrics like
 * height, ascent. Using the class developers can compute string width.

      // plain font
      var f = new zebkit.ui.Font("Arial", 14);

      // bold font
      var f = new zebkit.ui.Font("Arial", "bold", 14);

      // defining font with CSS font name
      var f = new zebkit.ui.Font("100px Futura, Helvetica, sans-serif");

  * @constructor
  * @param {String} name a name of the font. If size and style parameters
  * has not been passed the name is considered as CSS font name that
  * includes size and style
  * @param {String} [style] a style of the font: "bold", "italic", etc
  * @param {Integer} [size] a size of the font
  * @class zebkit.ui.Font
  */

import zebkit from '../..';

export default class Font {

    height: number;
    s: any;
    ascent: any;

    constructor(public family : string = 'Arial, Helvetica', public style? : string, public size? : string) {
        this.family = Font.family,
        this.style  = Font.style;

        if (arguments.length === 1) {
            this.size = decodeSize(family, pkg.Font.height);
            if (this.size === null) {
                // trim
                family = family.trim();

                // check if a predefined style has been used
                if (family === "bold" || family === "italic") {
                    this.style = family;
                } else {  // otherwise handle it as CSS-like font style
                    // try to parse font if possible
                    var re = /([a-zA-Z_\- ]+)?(([0-9]+px|[0-9]+em)\s+([,\"'a-zA-Z_ \-]+))?/,
                        m  = family.match(re);

                    if (m[4] != null) {
                        this.family = m[4].trim();
                    }

                    if (m[3] != null) {
                        this.size = m[3].trim();
                    }

                    if (m[1] != null) {
                        this.style = m[1].trim();
                    }

                    this.s = family;
                }
            }
        } else if (arguments.length === 2) {
            this.family = family;
            this.size   = decodeSize(style, pkg.Font.height);
            this.style  = this.size == null ? style : null;

        } else if (arguments.length === 3) {
            this.family = family;
            this.style  = style;
            this.size   = decodeSize(size, pkg.Font.height);
        }

        if (this.size == null) {
            this.size = Font.height + "px";
        }

        if (this.s == null) {
            this.s = ((this.style != null) ? this.style + " ": "") +
                      this.size + " " +
                      this.family;
        }

        var $fmText = Font.$fmText;
        if ($fmText.style.font !== this.s) {
            $fmText.style.font = this.s;
        }

        /**
         * Height of the font
         * @attribute height
         * @readOnly
         * @type {Integer}
         */
        this.height = $fmText.offsetHeight;

        //!!!
        // Something weird is going sometimes in IE10 !
        // Sometimes the property offsetHeight is 0 but
        // second attempt to access to the property gives
        // proper result
        if (this.height === 0) {
            this.height = $fmText.offsetHeight;
        }

        /**
         * Ascent of the font
         * @attribute ascent
         * @readOnly
         * @type {Integer}
         */
        this.ascent = Font.$fmImage.offsetTop - $fmText.offsetTop + 1;  
    }

    /**
     * Calculate the given string width in pixels
     * @param  {String} s a string whose width has to be computed
     * @return {Integer} a string size in pixels
     * @method stringWidth
     * @for zebkit.ui.Font
     */
    stringWidth(s) {
        if (s.length === 0) return 0;

        if (Font.$fmCanvas.font !== this.s) {
            Font.$fmCanvas.font = this.s;
        }

        return (Font.$fmCanvas.measureText(s).width + 0.5) | 0;
    }

    /**
     * Calculate the specified substring width
     * @param  {String} s a string
     * @param  {Integer} off fist character index
     * @param  {Integer} len length of substring
     * @return {Integer} a substring size in pixels
     * @method charsWidth
     * @for zebkit.ui.Font
     */
    charsWidth(s, off, len) {
        if (Font.$fmCanvas.font !== this.s) {
            Font.$fmCanvas.font = this.s;
        }

        return ( Font.$fmCanvas.measureText(len === 1 ? s[off]
                                                          : s.substring(off, off + len)).width + 0.5) | 0;
    };

    /**
     * Returns CSS font representation
     * @return {String} a CSS representation of the given Font
     * @method toString
     * @for zebkit.ui.Font
     */
    toString() {
        return this.s;
    }

    resize(size) {
        var nsize = decodeSize(size, this.height);
        if (nsize == null) {
            throw new Error("Invalid size : " + size);
        }
        return new Font(this.family, this.style, nsize);
    }

    restyle(style) {
        return new Font(this.family, style, this.height + "px");
    }

    static $fmCanvas = document.createElement("canvas").getContext("2d");
    static $fmText  = document.getElementById("zebkit.fm.text");
    static $fmImage: HTMLImageElement = <HTMLImageElement> document.getElementById("zebkit.fm.image");

    //the next function passed to zebkit.ready() will be blocked
    //till the picture is completely loaded
    static init() {
        this.$fmImage.onload = function() {
          zebkit.ready();
        }
        // set 1x1 transparent picture
        this.$fmImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjYAAAAAIAAeIhvDMAAAAASUVORK5CYII%3D';            
        }      
    }
    
}


// initialize font specific structures
zebkit.busy();



var e = document.getElementById("zebkit.fm");
if (e == null) {
    e = document.createElement("div");
    e.setAttribute("id", "zebkit.fm");  // !!! position fixed below allows to avoid 1px size in HTML layout for "zebkit.fm" element
    e.setAttribute("style", "visibility:hidden;line-height:0;height:1px;vertical-align:baseline;position:fixed;");
    e.innerHTML = "<span id='zebkit.fm.text' style='display:inline;vertical-align:baseline;'>&nbsp;</span>" +
                  "<img id='zebkit.fm.image' style='width:1px;height:1px;display:inline;vertical-align:baseline;' width='1' height='1'/>";
    document.body.appendChild(e);
}

