import Canvas from 'canvas';
import View from './View';
import { $validateValue } from '../../utils/validate';

export default class BundleView extends View {
    color: string;
    direction: string;

    constructor(dir, color) {
        super();        
        this.color = "#AAAAAA";
        this.direction = "vertical";
        if (arguments.length > 0) {
            this.direction = $validateValue(dir, "vertical", "horizontal");
            if (arguments.length > 1) this.color = color;
        }        
    }

    paint(g: Canvas ,x:number,y:number,w:number,h:number,d:number) {
        g.beginPath();
        if (this.direction === "vertical") {
            var r = w/2;
            g.arc(x + r, y + r, r, Math.PI, 0, false);
            g.lineTo(x + w, y + h - r);
            g.arc(x + r, y + h - r, r, 0, Math.PI, false);
            g.lineTo(x, y + r);
        } else {
            var r = h/2;
            g.arc(x + r, y + r, r, 0.5 * Math.PI, 1.5 * Math.PI, false);
            g.lineTo(x + w - r, y);
            g.arc(x + w - r, y + h - r, r, 1.5*Math.PI, 0.5*Math.PI, false);
            g.lineTo(x + r, y + h);
        }
        g.setColor(this.color);
        g.fill();
    }
}