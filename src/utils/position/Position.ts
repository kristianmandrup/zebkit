/**
 * Useful class to track a virtual cursor position in a structure that has
 * dedicated number of lines where every line has a number of elements. The
 * structure metric has to be described by providing an instance of
 * zebkit.util.Position.Metric interface that discovers how many
 * lines the structure has and how many elements every line includes.
 * @param {zebkit.util.Position.Metric} m a position metric
 * @constructor
 * @class  zebkit.util.Position
 */


/**
 * Fire when a virtual cursor position has been updated

        position.bind(function(src, prevOffset, prevLine, prevCol) {
            ...
        });

 * @event posChanged
 * @param {zebkit.util.Position} src an object that triggers the event
 * @param {Integer} prevOffest a previous virtual cursor offset
 * @param {Integer} prevLine a previous virtual cursor line
 * @param {Integer} prevCol a previous virtual cursor column in the previous line
 */
export default class Position {
    get $clazz() {
        this.Listeners = pkg.ListenersClass("posChanged"),

        /**
         * Position metric interface. This interface is designed for describing
         * a navigational structure that consists on number of lines where
         * every line consists of number of elements
         * @class zebkit.util.Position.Metric
         */

        /**
         * Get number of lines to navigate through
         * @return {Integer} a number of lines
         * @method  getLines
         */

         /**
          * Get a number of elements in the given line
          * @param {Integer} l a line index
          * @return {Integer} a number of elements in a line
          * @method  getLineSize
          */

         /**
          * Get a maximal element index (a last element of a last line)
          * @return {Integer} a maximal element index
          * @method  getMaxOffset
          */

        this.Metric = Interface([
            "abstract",
                function getLines()     {},
                function getLineSize()  {},
                function getMaxOffset() {}
        ]);
    }

    constructor() {
        /**
         * Set the specified virtual cursor offsest
         * @param {Integer} o an offset, pass null to set position to indefinite state
         * @return {Integer} an offset that has been set
         * @method setOffset
         */
        this.setOffset = function(o){
            if (o < 0) o = 0;
            else {
                if (o === null) o = -1;
                else {
                    var max = this.metrics.getMaxOffset();
                    if (o >= max) o = max;
                }
            }

            if (o != this.offset){
                var prevOffset = this.offset,
                    prevLine   = this.currentLine,
                    prevCol    = this.currentCol,
                    p          = this.getPointByOffset(o);

                this.offset = o;
                if (p != null){
                    this.currentLine = p[0];
                    this.currentCol  = p[1];
                }
                else {
                    this.currentLine = this.currentCol = -1;
                }
                this.isValid = true;
                this._.posChanged(this, prevOffset, prevLine, prevCol);
            }

            return o;
        };

        /**
         * Seek virtual cursor offset with the given shift
         * @param {Integer} off a shift
         * @return {Integer} an offset that has been set
         * @method seek
         */
        this.seek = function(off) {
            return this.setOffset(this.offset + off);
        };

        /**
         * Set the vurtual cursor line and the given column in the line
         * @param {Integer} r a line
         * @param {Integer} c a column in the line
         * @method setRowCol
         */
        this.setRowCol = function(r, c) {
            if (r != this.currentLine || c != this.currentCol){
                var prevOffset = this.offset,
                    prevLine = this.currentLine,
                    prevCol = this.currentCol;

                this.offset = this.getOffsetByPoint(r, c);
                this.currentLine = r;
                this.currentCol = c;
                this._.posChanged(this, prevOffset, prevLine, prevCol);
            }
        };

        this.inserted = function(off,size) {
            if (this.offset >= 0 && off <= this.offset){
                this.isValid = false;
                this.setOffset(this.offset + size);
            }
        };

        this.removed = function (off,size){
            if (this.offset >= 0 && this.offset >= off){
                this.isValid = false;
                this.setOffset(this.offset >= (off + size) ? this.offset - size
                                                           : off);
            }
        };

        /**
         * Calculate a line and line column by the given offset.
         * @param  {Integer} off an offset
         * @return {Array} an array that contains a line as the first
         * element and a column in the line as the second element.
         * @method getPointByOffset
         */
        this.getPointByOffset = function(off){
            if (off >= 0) {
                var m = this.metrics, max = m.getMaxOffset();
                if (off > max) {
                    throw new Error("Out of bounds:" + off);
                }

                if (max === 0) return [(m.getLines() > 0 ? 0 : -1), 0];
                if (off === 0) return [0, 0];

                var d = 0, sl = 0, so = 0;
                if (this.isValid === true && this.offset != -1) {
                    sl = this.currentLine;
                    so = this.offset - this.currentCol;
                    if (off > this.offset) d = 1;
                    else {
                        if (off < this.offset) d = -1;
                        else return [sl, this.currentCol];
                    }
                }
                else {
                    d = (~~(max / off) === 0) ? -1 : 1;
                    if (d < 0) {
                        sl = m.getLines() - 1;
                        so = max - m.getLineSize(sl);
                    }
                }

                for(; sl < m.getLines() && sl >= 0; sl += d){
                    var ls = m.getLineSize(sl);
                    if (off >= so && off < so + ls) {
                        return [sl, off - so];
                    }
                    so += d > 0 ? ls : -m.getLineSize(sl - 1);
                }
            }
            return null;
        };

        /**
         * Calculate an offset by the given line and column in the line
         * @param  {Integer} row a line
         * @param  {Integer} col a column in the line
         * @return {Integer} an offset
         * @method getOffsetByPoint
         */
        this.getOffsetByPoint = function (row, col){
            var startOffset = 0, startLine = 0, m = this.metrics;

            if (row >= m.getLines()) {
                throw new RangeError(row);
            }

            if (col >= m.getLineSize(row)) {
                throw new RangeError(col);
            }

            if (this.isValid === true && this.offset !=  -1) {
                startOffset = this.offset - this.currentCol;
                startLine = this.currentLine;
            }
            if (startLine <= row) {
                for(var i = startLine;i < row; i++) {
                    startOffset += m.getLineSize(i);
                }
            }
            else {
                for(var i = startLine - 1;i >= row; i--) {
                    startOffset -= m.getLineSize(i);
                }
            }
            return startOffset + col;
        };

        /**
         * Seek virtual cursor to the next position. How the method has to seek to the next position
         * has to be denoted by one of the following constants:

    - **"begin"** seek cursor to the begin of the current line
    - **"end"** seek cursor to the end of the current line
    - **"up"** seek cursor one line up
    - **"down"** seek cursor one line down

         * If the current virtual position is not known (-1) the method always sets
         * it to the first line, the first column in the line (offset is zero).
         * @param  {Integer} t   an action the seek has to be done
         * @param  {Integer} num number of seek actions
         * @method seekLineTo
         */
        this.seekLineTo = function(t,num){
            if (this.offset < 0){
                this.setOffset(0);
            }
            else {
                if (arguments.length === 1) num = 1;

                var prevOffset = this.offset, prevLine = this.currentLine, prevCol = this.currentCol;
                switch(t) {
                    case "begin":
                        if (this.currentCol > 0){
                            this.offset -= this.currentCol;
                            this.currentCol = 0;
                        } break;
                    case "end":
                        var maxCol = this.metrics.getLineSize(this.currentLine);
                        if (this.currentCol < (maxCol - 1)){
                            this.offset += (maxCol - this.currentCol - 1);
                            this.currentCol = maxCol - 1;
                        } break;
                    case "up":
                        if (this.currentLine > 0) {
                            this.offset -= (this.currentCol + 1);
                            this.currentLine--;
                            for(var i = 0;this.currentLine > 0 && i < (num - 1); i++, this.currentLine--){
                                this.offset -= this.metrics.getLineSize(this.currentLine);
                            }
                            var maxCol = this.metrics.getLineSize(this.currentLine);
                            if (this.currentCol < maxCol) this.offset -= (maxCol - this.currentCol - 1);
                            else this.currentCol = maxCol - 1;
                        } break;
                    case "down":
                        if (this.currentLine < (this.metrics.getLines() - 1)) {
                            this.offset += (this.metrics.getLineSize(this.currentLine) - this.currentCol);
                            this.currentLine++;
                            var size = this.metrics.getLines() - 1;
                            for(var i = 0;this.currentLine < size && i < (num - 1); i++ ,this.currentLine++ ){
                                this.offset += this.metrics.getLineSize(this.currentLine);
                            }
                            var maxCol = this.metrics.getLineSize(this.currentLine);
                            if (this.currentCol < maxCol) this.offset += this.currentCol;
                            else {
                                this.currentCol = maxCol - 1;
                                this.offset += this.currentCol;
                            }
                        } break;
                    default: throw new Error("" + t);
                }

                this._.posChanged(this, prevOffset, prevLine, prevCol);
            }
        };

        this[''] = function(pi){
            this._ = new this.clazz.Listeners();
            this.isValid = false;

            /**
             * Current virtual cursor line position
             * @attribute currentLine
             * @type {Integer}
             * @readOnly
             */

            /**
             * Current virtual cursor column position
             * @attribute currentCol
             * @type {Integer}
             * @readOnly
             */

            /**
             * Current virtual cursor offset
             * @attribute offset
             * @type {Integer}
             * @readOnly
             */

            this.currentLine = this.currentCol = this.offset = 0;
            this.setMetric(pi);
        };

        /**
         * Set position metric. Metric describes how many lines
         * and elements in these line the virtual cursor can be navigated
         * @param {zebkit.util.Position.Metric} p a position metric
         * @method setMetric
         */
        this.setMetric = function (p){
            if (p == null) throw new Error("Null metric");
            if (p != this.metrics){
                this.metrics = p;
                this.setOffset(null);
            }
        };
    }
}