import BaseTextRender from './BaseTextRender';
import utils from '../utils';
import data from '../data';
import ui from '../ui';
import TextModel from './TextModel';

/**
 * Text render that expects and draws a text model or a string as its target
 * @class zebkit.ui.TextRender
 * @constructor
 * @extends zebkit.ui.Render
 * @param  {String|zebkit.data.TextModel} text a text as string or text model object
 */
export default class TextRender extends BaseTextRender, util.Position.Metric {
    color: string;
    font: string | ui.Font;
    textWidth: number;
    textHeight: number;
    startInvLine: number;
    invLines: number;

    target: TextModel;
    clazz: {
      color: string;
      font: string | ui.Font;
    };

    // speed up constructor by avoiding super execution since
    // text render is one of the most used class

    constructor(text) {
        super(text);


        /**
         * Text color
         * @attribute color
         * @type {String}
         * @default zebkit.ui.TextRender.color
         * @readOnly
         */
        this.color = this.clazz.color;

        /**
         * Text font
         * @attribute font
         * @type {String|zebkit.ui.Font}
         * @default zebkit.ui.TextRender.font
         * @readOnly
         */
        this.font = this.clazz.font;


        this.textWidth = this.textHeight = this.startInvLine = this.invLines = 0;

        //!!!
        //   since text render is widely used structure we do slight hack -
        //   don't call parent constructor
        //!!!
        this.setTarget(utils.isString(text) ? new data.Text(text) : text);
    }

    /**
     * Get number of lines of target text
     * @return   {Integer} a number of line in the target text
     * @method getLines
     */
    getLines() {
        return this.target.getLines();
    }

    getLineSize(l) {
        return this.target.getLine(l).length + 1;
    }

    getMaxOffset() {
        return this.target.getTextLength();
    }

    /**
     * Paint the specified text line
     * @param  {2DContext} g graphical 2D context
     * @param  {Integer} x x coordinate
     * @param  {Integer} y y coordinate
     * @param  {Integer} line a line number
     * @param  {zebkit.ui.Panel} d an UI component on that the line has to be rendered
     * @method paintLine
     */
    paintLine(g,x,y,line,d) {
        g.fillText(this.getLine(line), x, y);
    }

    /**
     * Get text line by the given line number
     * @param  {Integer} r a line number
     * @return {String} a text line
     * @method getLine
     */
    getLine(r) {
        return this.target.getLine(r);
    };

    /**
     * Return a string that is rendered by this class
     * @return  {String} a string
     * @method getValue
     */
    getValue(){
        return this.target == null ? null : this.target.getValue();
    }

    /**
     * Set the text model content
     * @param  {String} s a text as string object
     * @method setValue
     */
    setValue(s) {
        this.target.setValue(s);
    }

    /**
     * Get the given text line width in pixels
     * @param  {Integer} line a text line number
     * @return {Integer} a text line width in pixels
     * @method lineWidth
     */
    calcLineWidth(line){
        if (this.invLines > 0) this.recalc();
        return this.target.$lineTags(line).$lineWidth;
    };

    /**
     * Called every time the target text metrics has to be recalculated
     * @method recalc
     */
    recalc() {
        if (this.invLines > 0 && this.target != null){
            var model = this.target;
            if (model != null) {
                if (this.invLines > 0) {
                    for(var i = this.startInvLine + this.invLines - 1; i >= this.startInvLine; i--) {
                        model.$lineTags(i).$lineWidth = this.font.stringWidth(this.getLine(i));
                    }
                    this.startInvLine = this.invLines = 0;
                }

                this.textWidth = 0;
                var size = model.getLines();
                for(var i = 0; i < size; i++){
                    var len = model.$lineTags(i).$lineWidth;
                    if (len > this.textWidth) {
                        this.textWidth = len;
                    }
                }
                this.textHeight = this.getLineHeight() * size + (size - 1) * this.lineIndent;
            }
        }
    }

    /**
     * Text model update listener handler
     * @param  {zebkit.data.TextModel} src text model object
     * @param  {Boolean} b
     * @param  {Integer} off an offset starting from that
     * the text has been updated
     * @param  {Integer} size a size (in character) of text part that
     * has been updated
     * @param  {Integer} ful a first affected by the given update line
     * @param  {Integer} updatedLines a number of text lines that have
     * been affected by text updating
     * @method textUpdated
     */
    textUpdated(src,b,off,size,ful,updatedLines){
        if (b === false) {
            if (this.invLines > 0) {
                var p1 = ful - this.startInvLine,
                    p2 = this.startInvLine + this.invLines - ful - updatedLines;
                this.invLines = ((p1 > 0) ? p1 : 0) + ((p2 > 0) ? p2 : 0) + 1;
                this.startInvLine = this.startInvLine < ful ? this.startInvLine : ful;
            }
            else {
                this.startInvLine = ful;
                this.invLines = 1;
            }

            if (this.owner != null && this.owner.isValid !== true) {
                this.owner.invalidate();
            }
        }
        else {
            if (this.invLines > 0){
                if (ful <= this.startInvLine) this.startInvLine += (updatedLines - 1);
                else {
                    if (ful < (this.startInvLine + size)) size += (updatedLines - 1);
                }
            }
            this.invalidate(ful, updatedLines);
        }
    }

    /**
     * Invalidate metrics for the specified range of lines.
     * @param  {Integer} start first line to be invalidated
     * @param  {Integer} size  number of lines to be invalidated
     * @method invalidate
     * @private
     */
    invalidate(start,size) {
        if (arguments.length === 0) {
            start = 0;
            size  = this.getLines();
            if (size === 0) {
                this.invLines = 0;
                return;
            }
        }

        if (size > 0 && (this.startInvLine != start || size != this.invLines)) {
            if (this.invLines === 0){
                this.startInvLine = start;
                this.invLines = size;
            }
            else {
                var e = this.startInvLine + this.invLines;
                this.startInvLine = start < this.startInvLine ? start : this.startInvLine;
                this.invLines     = Math.max(start + size, e) - this.startInvLine;
            }

            if (this.owner != null) {
                this.owner.invalidate();
            }
        }
    }

    getPreferredSize(){
        if (this.invLines > 0 && this.target != null) {
            this.recalc();
        }
        return { width:this.textWidth, height:this.textHeight };
    }

    paint(g,x,y,w,h,d) {
        var ts = g.$states[g.$curState];
        if (ts.width > 0 && ts.height > 0) {
            var lineIndent   = this.lineIndent,
                lineHeight   = this.getLineHeight(),
                lilh         = lineHeight + lineIndent,
                startInvLine = 0;

            w = ts.width  < w ? ts.width  : w;
            h = ts.height < h ? ts.height : h;

            if (y < ts.y) {
                startInvLine = Math.floor((lineIndent + ts.y - y) / lilh);
                h += (ts.y - startInvLine * lineHeight - startInvLine * lineIndent);
            } else {
                if (y > (ts.y + ts.height)) return;
            }

            var size = this.getLines();
            if (startInvLine < size){
                var lines = Math.floor((h + lineIndent) / lilh) + (((h + lineIndent) % lilh > lineIndent) ? 1 : 0);
                if (startInvLine + lines > size) {
                    lines = size - startInvLine;
                }
                y += startInvLine * lilh;

                // save few milliseconds
                if (this.font.s !== g.font) {
                    g.setFont(this.font);
                }

                if (d == null || d.isEnabled === true){
                    // save few milliseconds
                    if (this.color != g.fillStyle) {
                        g.fillStyle = this.color;
                    }

                    var p1 = null, p2 = null, bsel = false;
                    if (lines > 0 && d != null && d.getStartSelection != null) {
                        p1   = d.getStartSelection();
                        p2   = d.getEndSelection();
                        bsel = p1 != null && (p1.row !== p2.row || p1.col !== p2.col);
                    }

                    for(var i = 0; i < lines; i++){
                        if (bsel === true) {
                            var line = i + startInvLine;
                            if (line >= p1.row && line <= p2.row){
                                var s  = this.getLine(line),
                                    lw = this.calcLineWidth(line),
                                    xx = x;

                                if (line === p1.row) {
                                    var ww = this.font.charsWidth(s, 0, p1.col);
                                    xx += ww;
                                    lw -= ww;
                                    if (p1.row === p2.row) {
                                        lw -= this.font.charsWidth(s, p2.col, s.length - p2.col);
                                    }
                                }
                                else {
                                    if (line === p2.row) lw = this.font.charsWidth(s, 0, p2.col);
                                }
                                this.paintSelection(g, xx, y, lw === 0 ? 1 : lw, lilh, line, d);

                                // restore color to paint text since it can be
                                // res-set with paintSelection method
                                if (this.color !== g.fillStyle) g.fillStyle = this.color;
                            }
                        }

                        this.paintLine(g, x, y, i + startInvLine, d);
                        y += lilh;
                    }
                } else {
                    var dcol = d != null && d.disabledColor != null ? d.disabledColor
                                                                    : pkg.TextRender.disabledColor;

                    for(var i = 0;i < lines; i++) {
                        g.setColor(dcol);
                        this.paintLine(g, x, y, i + startInvLine, d);
                        y += lilh;
                    }
                }
            }
        }
    }

    /**
     * Paint the specified text selection of the given line. The area
     * where selection has to be rendered is denoted with the given
     * rectangular area.
     * @param  {2DContext} g a canvas graphical context
     * @param  {Integer} x a x coordinate of selection rectangular area
     * @param  {Integer} y a y coordinate of selection rectangular area
     * @param  {Integer} w a width of of selection rectangular area
     * @param  {Integer} h a height of of selection rectangular area
     * @param  {Integer} line [description]
     * @param  {zebkit.ui.Panel} d a target UI component where the text
     * has to be rendered
     * @protected
     * @method paintSelection
     */
    paintSelection(g, x, y, w, h, line, d){
        g.setColor(d.selectionColor);
        g.fillRect(x, y, w, h);
    }

    // TODO: FIX $super
    targetWasChanged = (o,n) => {
        // this.$super(o, n);
        if (o != null) o.unbind(this);
        if (n != null) {
            n.bind(this);
        }        
    }
}