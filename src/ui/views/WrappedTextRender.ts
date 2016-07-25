import TextRender from './TextRender';

export default class WrappedTextRender extends TextRender {
    constructor() {
        this.brokenLines = [];
        this.lastWidth = -1;

        this.breakLine = function (w, startIndex, line, lines) {
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
        };

        this.breakToLines = function (w) {
            var m = this.target, startIndex = 0, res = [];
            for(var i = 0; i < m.getLines(); i++) {
                var line = m.getLine(i);
                this.breakLine(w, startIndex, line, res);
            }
            return res;
        };

        this.getLines = function() {
            return this.brokenLines.length;
        };

        this.getLine = function(i) {
            return this.brokenLines[i];
        };
    },

    function invalidate(sl, len){
        this.$super(sl, len);
        if (this.brokenLines != null) {
            this.brokenLines.length = 0;
        }
        this.lastWidth = -1;
    },

    function getPreferredSize(pw, ph) {
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
        return this.$super();
    },

    function paint(g,x,y,w,h,d) {
        if (this.lastWidth < 0 || this.lastWidth !== w) {
            this.lastWidth = w;
            this.brokenLines = this.breakToLines(w);
        }
        this.$super(g,x,y,w,h,d);
    }
}