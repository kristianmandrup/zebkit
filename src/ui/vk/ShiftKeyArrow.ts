export default class ShiftKeyArrow extends View {
      //       / \A
      //      /   \
      //     /     \
      //    / C  F  \
      // B ^^^|  |^^^ G
      //      |__|
      //     D    E
      //
      // Proportions:
      //     AC = FG = w / 4
      //     CF = w / 2
      //     w =  h / 2

    lineColor: string;
    bg: string;
    prefSize: number;

    constructor(bg, lnCol?) {
        super();
        this.lineColor = lnCol != null ? lnCol: "white";
        this.bg        = bg;
        this.prefSize  = 10;
    }

    outline(g,x,y,w,h,d) {
        x += 4;
        y += 4;
        w -= 8;
        h -= 8;

        var cx = x + Math.floor(w / 2),
            ww = Math.floor(h / 2),
            dw = Math.floor(h / 4),
            dt = g.lineWidth/2;

        g.beginPath();
        g.moveTo(cx, y);                      // A
        g.lineTo(cx - ww + dt, y + ww + dt);  // B
        g.lineTo(cx - dw - dt, y + ww + dt);  // C
        g.lineTo(cx - dw - dt, y + h - dt);   // D
        g.lineTo(cx + dw + dt, y + h - dt);   // E
        g.lineTo(cx + dw + dt, y + ww + dt);  // F
        g.lineTo(cx + ww - dt, y + ww + dt);  // G
        g.lineTo(cx, y);                      // A
        return true;
    };

    paint(g,x,y,w,h,d) {
        this.outline(g,x,y,w,h,d);

        if (this.lineColor) {
            g.setColor(this.lineColor);
            g.stroke();
        }

        if (this.bg != null) {
            g.setColor(this.bg);
            g.fill();
        }
    }

    getPreferredSize() {
        return {
            width : this.prefSize,
            height: this.prefSize
        };
    }
}