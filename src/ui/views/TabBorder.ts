import View from './View';
import palette from '../utils/palette';

class TabBorder extends View {
    type: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;

    onColor1: string;
    onColor2: string;
    offColor: string;
    
    fillColor1: string;
    fillColor2: string;
    fillColor3: string;

    constructor(t:number, w:number) {
        super();
        if (arguments.length === 1) w = 1;

        this.type  = t;
        this.left  = this.top = this.bottom = this.right = 6 + w;
        this.width = w;

        this.onColor1 = palette.black;
        this.onColor2 = palette.gray5;
        this.offColor = palette.gray1;

        this.fillColor1 = "#DCF0F7";
        this.fillColor2 = palette.white;
        this.fillColor3 = palette.gray7;
    }

    paint(g,x,y,w,h,d){
        var xx = x + w - 1,
            yy = y + h - 1,
            o  = d.parent.orient,
            t  = this.type,
            s  = this.width,
            dt = s / 2;

        g.beginPath();
        g.lineWidth = s;
        switch(o) {
            case "left":
                g.moveTo(xx + 1, y + dt);
                g.lineTo(x + s*2, y + dt);
                g.lineTo(x + dt , y + s*2);
                g.lineTo(x + dt, yy - s*2 + dt);
                g.lineTo(x + s*2, yy + dt);
                g.lineTo(xx + 1, yy + dt);

                if (d.isEnabled === true){
                    g.setColor(t === 2 ? this.fillColor1 : this.fillColor2);
                    g.fill();
                }

                g.setColor((t === 0 || t === 2) ? this.onColor1 : this.offColor);
                g.stroke();

                if (d.isEnabled === true) {
                    var ww = Math.floor((w - 6) / 2);
                    g.setColor(this.fillColor3);
                    g.fillRect(xx - ww + 1, y + s, ww, h - s - 1);
                }

                if (t === 1) {
                    g.setColor(this.onColor2);
                    g.drawLine(x + 2*s + 1, yy - s, xx + 1, yy - s, s);
                }
                break;
            case "right":
                xx -= dt; // thick line grows left side and right side proportionally
                            // correct it

                g.moveTo(x, y + dt);
                g.lineTo(xx - 2*s, y + dt);

                g.lineTo(xx   , y + 2*s);
                g.lineTo(xx   , yy - 2*s);
                g.lineTo(xx - 2*s, yy + dt);
                g.lineTo(x, yy + dt);

                if (d.isEnabled === true){
                    g.setColor(t === 2 ? this.fillColor1 : this.fillColor2);
                    g.fill();
                }

                g.setColor((t === 0 || t === 2) ? this.onColor1 : this.offColor);
                g.stroke();

                if (d.isEnabled === true) {
                    var ww = Math.floor((w - 6) / 2);
                    g.setColor(this.fillColor3);
                    g.fillRect(x, y + s, ww, h - s - 1);
                }

                if (t === 1) {
                    g.setColor(this.onColor2);
                    g.drawLine(x, yy - s, xx - s - 1, yy - s, s);
                }
                break;
            case "top":
                g.moveTo(x + dt, yy + 1 );
                g.lineTo(x + dt, y + s*2);
                g.lineTo(x + s*2, y + dt);
                g.lineTo(xx - s*2 + s, y + dt);
                g.lineTo(xx + dt, y + s*2);
                g.lineTo(xx + dt, yy + 1);

                if (d.isEnabled === true){
                    g.setColor(t === 2 ? this.fillColor1 : this.fillColor2);
                    g.fill();
                }

                g.setColor((t === 0 || t === 2) ? this.onColor1 : this.offColor);
                g.stroke();

                if (d.isEnabled === true){
                    g.setColor(this.fillColor3);
                    var hh = Math.floor((h - 6) / 2);
                    g.fillRect(x + s, yy - hh + 1 , w - s - 1, hh);
                }

                if (t === 0) {
                    g.setColor(this.onColor2);
                    g.beginPath();
                    g.moveTo(xx + dt - s, yy + 1);
                    g.lineTo(xx + dt - s, y + s*2);
                    g.stroke();
                }

                break;
            case "bottom":
                yy -= dt;

                g.moveTo(x + dt, y);
                g.lineTo(x + dt, yy - 2*s);
                g.lineTo(x + 2*s + dt, yy);
                g.lineTo(xx - 2*s, yy);
                g.lineTo(xx + dt, yy - 2*s);
                g.lineTo(xx + dt, y);

                if (d.isEnabled === true){
                    g.setColor(t === 2 ? this.fillColor1 : this.fillColor2);
                    g.fill();
                }

                g.setColor((t === 0 || t === 2) ? this.onColor1 : this.offColor);
                g.stroke();

                if (d.isEnabled === true){
                    g.setColor(this.fillColor3);
                    var hh = Math.floor((h - 6) / 2);
                    g.fillRect(x + s, y, w - s - 1, hh);
                }

                if (t === 0) {
                    g.setColor(this.onColor2);
                    g.beginPath();
                    g.moveTo(xx + dt - s, y);
                    g.lineTo(xx + dt - s, yy - s - 1);
                    g.stroke();
                }
                break;
            default: throw new Error("Invalid tab alignment");
        }
    }

    getTop() { return this.top;   };
    getBottom() { return this.bottom;};
    getLeft () { return this.left;  };
    getRight () { return this.right; };
}
