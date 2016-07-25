import View from './View';
import Border from '../ui/Border';

/**
 * Toggle view element class
 * @class  zebkit.ui.ToggleView
 * @extends {zebkit.ui.View}
 * @constructor
 * @param  {Boolean} plus indicates the sign type plus (true) or minus (false)
 * @param  {String} color a color
 * @param  {String} bg a background
 */
class ToggleView extends View {
    color: string;
    bg: string;
    plus: boolean;
    br: any; // Border
    width: number;
    height: number;

    constructor(plus:boolean, color:string, bg:any, size:number) {
      super();        
        this.color = "white";
        this.bg    = "lightGray";
        this.plus  = false
        this.br    = new Border("rgb(65, 131, 215)", 1, 3);
        this.width = this.height = 12;

        if (arguments.length > 0) {
            this.plus = plus;
            if (arguments.length > 1) {
                this.color = color;
                if (arguments.length > 2) {
                    this.bg = bg;
                    if (arguments.length > 3) {
                        this.width = this.height = size;
                    }
                }
            }
        }      
      }

    paint(g, x, y, w, h, d) {
        if (this.br !== null) {
            this.br.outline(g, x, y, w, h, d);
        }

        g.setColor(this.bg);
        g.fill();
        this.br.paint(g, x, y, w, h, d);

        g.setColor(this.color);
        g.lineWidth = 2;
        x+=2;
        w-=4;
        h-=4;
        y+=2;
        g.beginPath();
        g.moveTo(x, y + h / 2);
        g.lineTo(x + w, y + h / 2);
        if (this.plus) {
            g.moveTo(x + w / 2, y);
            g.lineTo(x + w / 2, y + h);
        }

        g.stroke();
        g.lineWidth = 1;
    }

    getPreferredSize() {
        return { 
          width: this.width, 
          height: this.height 
        };
    }
}