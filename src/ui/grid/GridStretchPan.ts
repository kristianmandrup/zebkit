import Panel from '../ui/Panel'

/**
 * Special UI panel that manages to stretch grid columns to occupy the whole panel space.
 *

        ...

        var canvas = new zebkit.ui.zCanvas();
        var grid = new zebkit.ui.grid.Grid(100,10);
        var pan  = new zebkit.ui.grid.GridStretchPan(grid);

        canvas.root.setLayout(new zebkit.layout.BorderLayout());
        canvas.root.add("center", pan);

        ...

 * @constructor
 * @param {zebkit.ui.grid.Grid} grid a grid component that has to be added in the panel
 * @class zebkit.ui.grid.GridStretchPan
 * @extends {zebkit.ui.Panel}
 */
export default class GridStretchPan extends Panel {
    grid: any;

    protected $widths: number[];
    protected $props
    protected $strPs: any;
    protected $prevWidth = 0;
    protected $propW = -1;

    constructor(grid){
        super();
        /**
         * Target grid component
         * @type {zebkit.ui.Grid}
         * @readOnly
         * @attribute grid
         */
        this.grid = grid;

        this.$widths = [];
        this.$props = this.$strPs = null;
        this.$prevWidth = 0;
        this.$propW = -1;
        this.add(grid);
        
    }        

    calcPreferredSize(target) {
        this.recalcPS();
        return (target.kids.length === 0 ||
                target.grid.isVisible === false) ? { width:0, height:0 }
                                                    : { width:this.$strPs.width,
                                                        height:this.$strPs.height };
    }

    doLayout(target){
        this.recalcPS();
        if (target.kids.length > 0){
            var grid = this.grid,
                left = target.getLeft(),
                top = target.getTop();

            if (grid.isVisible === true) {
                grid.setBounds(left, top,
                                target.width  - left - target.getRight(),
                                target.height - top  - target.getBottom());

                for(var i = 0; i < this.$widths.length; i++) {
                    grid.setColWidth(i, this.$widths[i]);
                }
            }
        }
    }

    captionResized(src, col, pw){
        if (col < this.$widths.length - 1) {
            var grid = this.grid,
                w    = grid.getColWidth(col),
                dt   = w - pw;

            if (dt < 0) {
                grid.setColWidth(col + 1, grid.getColWidth(col + 1) - dt);
            } else {
                var ww = grid.getColWidth(col + 1) - dt,
                    mw = this.getMinWidth();

                if (ww < mw) {
                    grid.setColWidth(col, w - (mw - ww));
                    grid.setColWidth(col + 1, mw);
                } else {
                    grid.setColWidth(col + 1, ww);
                }
            }

            this.$propW = -1;
        }
    }

    getMinWidth() {
        return zebkit.instanceOf(this.grid.topCaption, pkg.BaseCaption) ? this.grid.topCaption.minSize
                                                                        : 10;
    }

    calcColWidths(targetAreaW){
        var grid = this.grid,
            cols = grid.getGridCols(),
            ew   = targetAreaW - (this.$props.length + 1) * grid.lineSize,
            sw   = 0;

        if (this.$widths == null || this.$widths.length != cols) {
            this.$widths = Array(cols);
        }

        for(var i = 0; i < cols; i++){
            if (this.$props.length - 1 === i) {
                this.$widths[i] = ew - sw;
            } else {
                this.$widths[i] = Math.round(ew * this.$props[i]);
                sw += this.$widths[i];
            }
        }
    }

    recalcPS(){
        var grid = this.grid;
        if (grid != null && grid.isVisible === true) {
            // calculate size excluding padding where
            // the target grid columns have to be stretched
            var p        = this.parent,
                isScr    = zebkit.instanceOf(p, ui.ScrollPan),
                taWidth  = (isScr ? p.width - p.getLeft() - p.getRight() - this.getRight() - this.getLeft()
                                    : this.width - this.getRight() - this.getLeft()),
                taHeight = (isScr ? p.height - p.getTop() - p.getBottom() - this.getBottom() - this.getTop()
                                    : this.height - this.getBottom() - this.getTop());

            // exclude left caption
            if (this.grid.leftCaption != null &&
                this.grid.leftCaption.isVisible === true)
            {
                taWidth -= this.grid.leftCaption.getPreferredSize().width;
            }

            if (this.$strPs == null || this.$prevWidth  != taWidth)
            {
                if (this.$propW < 0 || this.$props == null || this.$props.length != cols) {
                    // calculate col proportions
                    var cols = grid.getGridCols();
                    if (this.$props == null || this.$props.length !== cols) {
                        this.$props = Array(cols);
                    }
                    this.$propW = 0;

                    for(var i = 0; i < cols; i++){
                        var w = grid.getColWidth(i);
                        if (w === 0) w = grid.getColPSWidth(i);
                        this.$propW += w;
                    }

                    for(var i = 0; i < cols; i++){
                        var w = grid.getColWidth(i);
                        if (w === 0) w = grid.getColPSWidth(i);
                        this.$props[i] = w / this.$propW;
                    }
                }

                this.$prevWidth  = taWidth;
                this.calcColWidths(taWidth);
                this.$strPs   = {
                    width : taWidth,
                    height: grid.getPreferredSize().height
                };

                // check if the calculated height is greater than
                // height of the parent component and re-calculate
                // the metrics if vertical scroll bar is required
                // taking in account horizontal reduction because of
                // the scroll bar visibility
                if (isScr === true &&
                    p.height > 0 &&
                    p.vBar != null &&
                    p.autoHide === false &&
                    taHeight < this.$strPs.height)
                {
                    taWidth -= p.vBar.getPreferredSize().width;
                    this.calcColWidths(taWidth);
                    this.$strPs.width = taWidth;
                }
            }
        }
    }

    kidAdded(index,constr,l){
        this.$propsW = -1;
        if (l.topCaption != null) {
            l.topCaption.bind(this);
        }
        this.scrollManager = l.scrollManager;
        super.kidAdded(index, constr, l);
    }

    kidRemoved(i,l){
        this.$propsW = -1;
        if (l.topCaption != null) {
            l.topCaption.unbind(this);
        }
        this.scrollManager = null;
        super.kidRemoved(i, l);
    }

    invalidate(){
        this.$strPs = null;
        super.invalidate();
    }
}
