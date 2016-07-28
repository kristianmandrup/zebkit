/**
 * Grid caption base UI component class. This class has to be used
 * as base to implement grid caption components
 * @class  zebkit.ui.grid.BaseCaption
 * @extends {zebkit.ui.Panel}
 * @constructor
 * @param {Array} [titles] a caption component titles
 */

/**
 * Fire when a grid row selection state has been changed

        caption.bind(function captionResized(caption, rowcol, phw) {
            ...
        });

 * @event captionResized
 * @param  {zebkit.ui.grid.BaseCaption} caption a caption
 * @param  {Integer} rowcol a row or column that has been resized
 * @param  {Integer} pwh a a previous row or column size
 */

import Panel from '../core/Panel';

abstract class BaseCaption extends Panel {
    clazz() {
        this.Listeners = new zebkit.util.ListenersClass("captionResized");
    }

    orient: string;
    metrics: any;
    pxy: number;
    selectedColRow: number;
    minSize: number;
    activeAreaSize: number;
    lineColor: string;
    isAutoFit: boolean;
    isResizable: boolean;
    constraints: any;

    constructor(titles) {
        super();
        this._ = new this.clazz.Listeners();
        this.orient = this.metrics = this.pxy = null;
        this.selectedColRow = -1;
        if (titles != null) {
            for(var i=0; i < titles.length; i++) {
                this.putTitle(i, titles[i]);
            }
        }
        
        /**
         * Minimal possible grid cell size
         * @type {Number}
         * @default 10
         * @attribute minSize
         */
        this.minSize = 10;

        /**
         * Size of the active area where cells size can be changed by pointer dragging event
         * @attribute activeAreaSize
         * @type {Number}
         * @default 5
         */
        this.activeAreaSize = 5;

        /**
         * Caption line color
         * @attribute lineColor
         * @type {String}
         * @default "gray"
         */
        this.lineColor = "gray";

        /**
         * Indicate if the grid cell size has to be adjusted according
         * to the cell preferred size by pointer double click event.
         * @attribute isAutoFit
         * @default true
         * @type {Boolean}
         */

        /**
         * Indicate if the grid cells are resize-able.
         * to the cell preferred size by pointer double click event.
         * @attribute isResizable
         * @default true
         * @type {Boolean}
         */
        this.isAutoFit = this.isResizable = true;
    }

    getCursorType(target,x,y){
        return this.metrics != null     &&
                this.selectedColRow >= 0 &&
                this.isResizable         &&
                this.metrics.isUsePsMetric === false ? ((this.orient === "horizontal") ? ui.Cursor.W_RESIZE
                                                                                        : ui.Cursor.S_RESIZE)
                                                    : null;
    }

    /**
     * Define pointer dragged events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragged
     */
    pointerDragged(e){
        if (this.pxy != null) {
            var b  = (this.orient === "horizontal"),
                rc = this.selectedColRow,
                ns = (b ? this.metrics.getColWidth(rc) + e.x
                        : this.metrics.getRowHeight(rc) + e.y) - this.pxy;

            this.captionResized(rc, ns);

            if (ns > this.minSize) {
                this.pxy = b ? e.x : e.y;
            }
        }
    }

    /**
     * Define pointer drag started events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragStarted
     */
    pointerDragStarted(e){
        if (this.metrics != null &&
            this.isResizable     &&
            this.metrics.isUsePsMetric === false)
        {
            this.calcRowColAt(e.x, e.y);

            if (this.selectedColRow >= 0) {
                this.pxy = (this.orient === "horizontal") ? e.x
                                                            : e.y;
            }
        }
    }

    /**
     * Define pointer drag ended events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragEnded
     */
    pointerDragEnded(e){
        if (this.pxy != null) {
            this.pxy = null;
        }

        if (this.metrics != null) {
            this.calcRowColAt(e.x, e.y);
        }
    }

    /**
     * Define pointer moved events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerMoved
     */
    pointerMoved(e) {
        if (this.metrics != null) {
            this.calcRowColAt(e.x, e.y);
        }
    }

    /**
     * Define pointer clicked events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerClicked
     */
    pointerDoubleClicked(e){
        if (this.pxy     == null     &&
            this.metrics != null     &&
            this.selectedColRow >= 0 &&
            this.isAutoFit === true     )
        {
            var size = this.getCaptionPS(this.selectedColRow);
            if (this.orient === "horizontal") {
                this.metrics.setColWidth (this.selectedColRow, size);
            } else {
                this.metrics.setRowHeight(this.selectedColRow, size);
            }
            this.captionResized(this.selectedColRow, size);
        }
    };

    /**
     * Get the given row or column caption preferred size
     * @param  {Integer} rowcol a row or column of a caption
     * @return {Integer}  a size of row or column caption
     * @method getCaptionPS
     */
    getCaptionPS(rowcol) {
        return 0;
    };

    captionResized(rowcol, ns) {
        if (ns > this.minSize) {
            if (this.orient === "horizontal") {
                var pw = this.metrics.getColWidth(rowcol);
                this.metrics.setColWidth(rowcol, ns);
                this._.captionResized(this, rowcol, pw);
            } else  {
                var ph = this.metrics.getRowHeight(rowcol);
                this.metrics.setRowHeight(rowcol, ns);
                this._.captionResized(this, rowcol, ph);
            }
        }
    }

    calcRowColAt(x, y){
        var $this = this;
        this.selectedColRow = this.getCaptionAt(x, y, function(m, xy, xxyy, wh, i) {
            xxyy += (wh + m.lineSize);
            return (xy < xxyy + $this.activeAreaSize &&
                    xy > xxyy - $this.activeAreaSize   );

        });
    }

    /**
     * Compute a column (for horizontal caption component) or row (for
     * vertically aligned caption component) at the given location
     * @param  {Integer} x a x coordinate
     * @param  {Integer} y an y coordinate
     * @param  {Function} [f] an optional match function. The method can be passed
     * if you need to detect a particular area of row or column. The method gets
     * a grid metrics as the first argument, a x or y location to be detected,
     * a row or column y or x coordinate, a row or column height or width and
     * row or column index. The method has to return true if the given location
     * is in.
     * @return {Integer}  a row or column
     * @method calcRowColAt
     */
    getCaptionAt(x,y,f){
        if (this.metrics != null &&
            x >= 0               &&
            y >= 0               &&
            x < this.width       &&
            y < this.height        )
        {
            var m     = this.metrics,
                cv    = m.getCellsVisibility(),
                isHor = (this.orient === "horizontal");

            if ((isHor && cv.fc != null) || (isHor === false && cv.fr != null)) {
                var gap  = m.lineSize,
                    xy   = isHor ? x : y,
                    xxyy = isHor ? cv.fc[1] - this.x - gap + m.getXOrigin()
                                    : cv.fr[1] - this.y - gap + m.getYOrigin();

                for(var i = (isHor ? cv.fc[0] : cv.fr[0]);i <= (isHor ? cv.lc[0] : cv.lr[0]); i ++ ){
                    var wh = isHor ? m.getColWidth(i) : m.getRowHeight(i);
                    if ((f != null && f(m, xy, xxyy, wh, i)) || (f == null && xy > xxyy && xy < xxyy + wh)) {
                        return i;
                    }
                    xxyy += wh + gap;
                }
            }
        }
        return -1;
    }

    paintOnTop(g) {
        if (this.lineColor != null && this.metrics != null) {
            var v = this.metrics.getCellsVisibility();
            if (v != null) {
                var m       = this.metrics,
                    b       = this.orient === "horizontal",
                    startRC = b ? v.fc[0] : v.fr[0],
                    endRC   = b ? v.lc[0] : v.lr[0],
                    xy      = b ? v.fc[1] - this.x - m.lineSize + m.getXOrigin()
                                : v.fr[1] - this.y - m.lineSize + m.getYOrigin();

                g.setColor(this.lineColor);
                for(var i = startRC; i <= endRC; i++) {
                    if (i !== 0) {
                        if (b) g.drawLine(xy, 0, xy, this.height, m.lineSize);
                        else   g.drawLine(0, xy, this.width, xy, m.lineSize);
                    }
                    xy += (b ? m.getColWidth(i): m.getRowHeight(i)) + m.lineSize;
                }
            }
        }
    }

    /**
     * Implement the method to be aware when number of rows or columns in
     * a grid model has been updated
     * @param  {zebkit.ui.grid.Grid} target a target grid
     * @param  {Integer} prevRows a previous number of rows
     * @param  {Integer} prevCols a previous number of columns
     * @method matrixResized
     */

    /**
     * Implement the method to be aware when a grid model data has been
     * re-ordered.
     * @param  {zebkit.ui.grid.Grid} target a target grid
     * @param  {Object} sortInfo an order information
     * @method matrixSorted
     */

    setParent(p) {
        super.setParent(p);

        this.metrics = this.orient = null;
        if (p == null || zebkit.instanceOf(p, pkg.Metrics)) {
            this.metrics = p;
            if (this.constraints != null) {
                this.orient = (this.constraints === "top"   ||
                               this.constraints === "bottom"  ) ? "horizontal"
                                                                : "vertical";
            }
        }
    }
}

export default BaseCaption;