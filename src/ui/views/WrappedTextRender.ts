import TextRender from './TextRender';

export default class WrappedTextRender extends TextRender {
    brokenLines: string[];
    lastWidth: number;

    constructor(txt) {
        super(txt);

        this.brokenLines = [];
        this.lastWidth = -1;
    }

    breakLine(w, startIndex, line, lines) {
        if (line === "") {
            lines.push(line);
        } else {
            var breakIndex = startIndex < line.length ? startIndex : line.length - 1,
                direction  = 0;

            for(; breakIndex >= 0 && breakIndex < line.length ;) {
                var substrLen = this.font.charsWidth(line, 0, breakIndex + 1);
                if (substrLen < w) {
                    if (direction < 0) break;
                    else direction = 1;
                    breakIndex ++;
                }
                else if (substrLen > w) {
                    breakIndex--;
                    if (direction > 0) break;
                    else               direction = -1;
                }
                else {
                    break;
                }
            }

            if (breakIndex >= 0) {
                lines.push(line.substring(0, breakIndex + 1));
                if (breakIndex < line.length - 1) {
                    this.breakLine(w, startIndex, line.substring(breakIndex + 1), lines);
                }
            }
        }
    }

    breakToLines(w) {
        var m = this.target, startIndex = 0, res = [];
        for(var i = 0; i < m.getLines(); i++) {
            var line = m.getLine(i);
            this.breakLine(w, startIndex, line, res);
        }
        return res;
    }

    getLines() {
        return this.brokenLines.length;
    }

    getLine(i) {
        return this.brokenLines[i];
    }

    // static

    invalidate(sl, len){
        super.invalidate(sl, len);
        if (this.brokenLines != null) {
            this.brokenLines.length = 0;
        }
        this.lastWidth = -1;
    }

    getPreferredSize(pw, ph) {
        if (arguments.length === 2) {
            if (this.lastWidth < 0 || this.lastWidth !== pw) {
                this.lastWidth = pw;
                this.brokenLines = this.breakToLines(pw);
            }
            return {
                width  : pw,
                height : this.brokenLines.length * this.getLineHeight() + (this.brokenLines.length - 1) * this.lineIndent
            };
        }
        return super.getPreferredSize();
    }

    paint(g,x,y,w,h,d) {
        if (this.lastWidth < 0 || this.lastWidth !== w) {
            this.lastWidth = w;
            this.brokenLines = this.breakToLines(w);
        }
        super.paint(g,x,y,w,h,d);
    }
}