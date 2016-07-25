import TextRender from './TextRender';
import utils from '../utils';

export default class DecoratedTextRender extends TextRender {
    decorations: {};
    lineWidth: number;

    constructor(text) {
        super(text);
        this.decorations = {};
        this.lineWidth = 1;        
    }

    setDecoration(id, color) {
        if (id == null) throw new Error();
        this.decorations[id] = color;
        return this;
    }

    setDecorations(d) {
        this.decorations = utils.clone(d);
        return this;
    }

    paintLine(g ,x,y,line,d) {
        super.paintLine(g,x,y,line,d);

        var lw = this.calcLineWidth(line),
            lh = this.getLineHeight(line);

        if (this.decorations.underline != null) {
            g.lineWidth = this.lineWidth;
            g.setColor(this.decorations.underline);

            console.log("UNDERLINE: color = " + this.decorations.underline );

            g.drawLine(x, y + lh - 1, x + lw, y  + lh - 1);
        }

        if (this.decorations.strike != null) {
            var yy = y + Math.round(lh / 2) - 1;
            g.setColor(this.decorations.strike);
            g.lineWidth = this.lineWidth;
            g.drawLine(x, yy, x + lw, yy);
        }
    }
}