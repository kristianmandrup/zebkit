import BaseTextRender from './BaseTextRender';

/**
 * Lightweight implementation of single line string render. The render requires
 * a simple string as a target object.
 * @param {String} str a string to be rendered
 * @param {zebkit.ui.Font} [font] a text font
 * @param {String} [color] a text color
 * @constructor
 * @extends {zebkit.ui.Render}
 * @class zebkit.ui.StringRender
 */
export default class StringRender extends BaseTextRender {
    stringWidth: number;
    clazz: any; // FIX

    constructor(public txt: string, public font: string, public color : string) {
        super(txt);

        this.stringWidth = -1;


        this.setTarget(txt);

        /**
         * Font to be used to render the target string
         * @attribute font
         * @readOnly
         * @type {zebkit.ui.Font}
         */
        this.font = font != null ? font : this.clazz.font;

        /**
         * Color to be used to render the target string
         * @readOnly
         * @attribute color
         * @type {String}
         */
        this.color = color != null ? color : this.clazz.color;
    }

    // implement position metric methods
    getMaxOffset() {
        return this.target.length;
    }

    getLineSize(l) {
        return this.target.length + 1;
    }

    getLines() {
        return 1;
    }

    calcLineWidth() {
        if (this.stringWidth < 0) {
            this.stringWidth = this.font.stringWidth(this.target);
        }
        return this.stringWidth;
    }

    invalidate () {
        this.stringWidth = -1;
    }

    paint(g,x,y,w,h,d) {
        // save a few milliseconds
        if (this.font.s !== g.font) {
            g.setFont(this.font);
        }

        if (d != null && d.getStartSelection != null) {
            var startSel = d.getStartSelection(),
                endSel   = d.getEndSelection();

            if (startSel != null && endSel != null && startSel.col !== endSel.col) {
                g.setColor(d.selectionColor);

                g.fillRect( x + this.font.charsWidth(this.target, 0, startSel.col),
                            y,
                            this.font.charsWidth(this.target,
                                                    startSel.col,
                                                    endSel.col - startSel.col),
                            this.getLineHeight());
            }
        }

        // save a few milliseconds
        if (this.color !== g.fillStyle) {
            g.fillStyle = this.color;
        }

        if (d != null && d.isEnabled === false) {
            g.fillStyle = d != null && d.disabledColor != null ? d.disabledColor
                                                                : this.clazz.disabledColor;
        }

        g.fillText(this.target, x, y);
    }

    // static

    /**
     * Return a string that is rendered by this class
     * @return  {String} a string
     * @method getValue
     */
    getValue(){
        return this.target;
    };

    /**
     * Set the string to be rendered
     * @param  {String} s a string
     * @method setValue
     */
    setValue(s) {
        this.setTarget(s);
    };

    getLine(l) {
        console.log("l = " + l);

        if (l < 0 || l > 1) {
            throw new RangeError();
        }
        return this.target;
    };

    getPreferredSize() {
        if (this.stringWidth < 0) {
            this.stringWidth = this.font.stringWidth(this.target);
        }

        return {
            width: this.stringWidth,
            height: this.font.height
        };
    }
}