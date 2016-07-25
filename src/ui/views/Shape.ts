import View from './View';

class Shape extends View {
    color: string;
    gap: number;
    width: number;

    constructor(c, w){
        super();
        this.color = "gray";
        this.gap   = this.width = 1;

        if (arguments.length > 0) this.color = c;
        if (arguments.length > 1) this.width = this.gap = w;
    }


    paint(g,x,y,w,h,d) {
        if (g.lineWidth !== this.width) {
            g.lineWidth = this.width;
        }

        this.outline(g,x,y,w,h,d);
        g.setColor(this.color);
        g.stroke();
    }        
}
