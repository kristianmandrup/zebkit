import View from './View';

export default class ArrowView extends View {
    lineWidth: number;
    width: number;
    height: number;
    fill: boolean;
    color: string;
    direction: string;

    constructor(d, col, w) {
        super();
        this.lineWidth = 1;
        this.fill = true;
        this.gap  = 0;
        this.color  = "black";
        this.width = this.height = 6;
        this.direction = "bottom";
        
        if (d   != null) this.direction = d;
        if (col != null) this.color = col;
        if (w   != null) this.width = this.height = w;
    }

    outline(g, x, y, w, h, d) {
        x += this.gap;
        y += this.gap;
        w -= this.gap * 2;
        h -= this.gap * 2;

        var dt = this.lineWidth / 2,
            w2 = Math.round(w / 2) - (w % 2 === 0 ? 0 : dt),
            h2 = Math.round(h / 2) - (h % 2 === 0 ? 0 : dt);

        g.beginPath();

        if ("bottom" === this.direction) {
            g.moveTo(x, y + dt);
            g.lineTo(x + w - 1, y + dt);
            g.lineTo(x + w2, y + h - dt);
            g.lineTo(x + dt, y + dt);
        }
        else {
            if ("top" === this.direction) {
                g.moveTo(x, y + h - dt);
                g.lineTo(x + w - 1, y + h - dt);
                g.lineTo(x + w2, y);
                g.lineTo(x + dt, y + h - dt);
            }
            else {
                if ("left" === this.direction) {
                    g.moveTo(x + w - dt, y);
                    g.lineTo(x + w - dt, y + h - 1);
                    g.lineTo(x, y + h2);
                    g.lineTo(x + w + dt, y);
                }
                else {
                    if ("right" === this.direction) {
                        g.moveTo(x + dt, y);
                        g.lineTo(x + dt, y + h - 1);
                        g.lineTo(x + w, y + h2);
                        g.lineTo(x - dt, y);
                    }
                    else {
                        throw new Error("" + this.direction);
                    }
                }
            }
        }
        return true;
    }

    setGap(gap) {
        this.gap = gap;
        return this;
    }

    paint(g, x, y, w, h, d) {
        this.outline(g, x, y, w, h, d);
        g.setColor(this.color);
        g.lineWidth = this.lineWidth;

        if (this.fill === true) {
            g.fill();
        }
        else {
            g.stroke();
        }
    }

    getPreferredSize() {
        return { 
            width  : this.width  + this.gap * 2,
            height : this.height + this.gap * 2 
        };
    }
}