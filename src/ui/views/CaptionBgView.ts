import Canvas from 'canvas';
import View from './View';

export default class CaptionBgView extends View {
    gap: number;
    radius: number;
    bg: string;

    constructor(bg) {            
        super();
        this.gap = this.radius = 6;
        this.bg  = "#66CCFF";

        if (bg != null) this.bg = bg;
    }

    paint(g, x:number,y:number,w:number,h:number,d:number) {
        this.outline(g,x,y,w,h,d);
        g.setColor(this.bg);
        g.fill();
    }

    outline(g, x:number,y:number,w:number,h:number,d:number) {
        g.beginPath();
        g.moveTo(x + this.radius, y);
        g.lineTo(x + w - this.radius*2, y);
        g.quadraticCurveTo(x + w, y, x + w, y + this.radius);
        g.lineTo(x + w, y + h);
        g.lineTo(x, y + h);
        g.lineTo(x, y + this.radius);
        g.quadraticCurveTo(x, y, x + this.radius, y);
        return true;
    }
}