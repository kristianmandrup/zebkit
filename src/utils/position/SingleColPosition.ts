import Position from './Position';

export default class SingleColPosition extends Position {
    constructor(pi) {
        super(pi);
    }

    setRowCol(r,c) {
        this.setOffset(r);
    };

    setOffset(o){
        if (o < 0) o = 0;
        else {
            if (o == null) o = -1;
            else {
                var max = this.metrics.getMaxOffset();
                if (o >= max) o = max;
            }
        }

        if (o != this.offset) {
            var prevOffset = this.offset,
                prevLine   = this.currentLine,
                prevCol    = this.currentCol;

            this.currentLine = this.offset = o;
            this.isValid = true;
            this._.posChanged(this, prevOffset, prevLine, prevCol);
        }

        return o;
    };

    seekLineTo(t, num){
        if (this.offset < 0){
            this.setOffset(0);
        }
        else {
            if (arguments.length === 1) num = 1;
            switch(t) {
                case "begin":
                case "end": break;
                case "up":
                    if (this.offset > 0) {
                        this.setOffset(this.offset - n);
                    } break;
                case "down":
                    if (this.offset < (this.metrics.getLines() - 1)){
                        this.setOffset(this.offset + n);
                    } break;
                default: throw new Error("" + t);
            }
        }
    }
}