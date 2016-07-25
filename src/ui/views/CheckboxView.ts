import Canvas from 'canvas';
import View from './View';

export default class CheckboxView extends View {
    color: number|string;

    constructor(color) {
        super();
        this.color = "rgb(65, 131, 255)";
        if (arguments.length > 0) this.color = color;                  
    }

    paint(g: Canvas ,x:number,y:number,w:number,h:number,d:number) {
        g.beginPath();
        g.strokeStyle = this.color;
        g.lineWidth = 2;
        g.moveTo(x + 1, y + 2);
        g.lineTo(x + w - 3, y + h - 3);
        g.stroke();
        g.beginPath();
        g.moveTo(x + w - 2, y + 2);
        g.lineTo(x + 2, y + h - 2);
        g.stroke();
        g.lineWidth = 1;
    }
}