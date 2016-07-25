import View from './View';

class LineView extends View {
    side: string;
    color: string;
    lineWidth: number;

    constructor(side, color, lineWidth) {
        super();
        this.side      = "top";
        this.color     = "black";
        this.lineWidth = 1;
        if (side != null)      this.side      = side;
        if (color != null)     this.color     = color;
        if (lineWidth != null) this.lineWidth = lineWidth;
    }

    paint(g,x,y,w,h,d) {
        g.setColor(this.color);
        g.beginPath();
        g.lineWidth = this.lineWidth;

        d = this.lineWidth / 2;
        if (this.side === "top") {
            g.moveTo(x, y + d);
            g.lineTo(x + w - 1, y + d);
        }
        else {
            if (this.side === "bottom") {
                g.moveTo(x, y + h - d);
                g.lineTo(x + w - 1, y + h - d);
            }
        }
        g.stroke();
    }

    getPreferredSize() {
        return {
            width  : this.lineWidth,
            height : this.lineWidth
        };
    }
}