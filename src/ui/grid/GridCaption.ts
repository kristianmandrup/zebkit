import GridCaption from './GridCaption';


class LeftGridCaption extends GridCaption {
    function $prototype() {
        this.constraints = "left";
    }
}


/**
 * Grid caption class that implements rendered caption.
 * Rendered means all caption titles, border are painted
 * as a number of views.
 * @param  {Array} [titles] a caption titles. Title can be a string or
 * a zebkit.ui.View class instance
 * @param  {zebkit.ui.StringRender|zebkit.ui.TextRender} [render] a text render to be used
 * to paint grid titles
 * @constructor
 * @class zebkit.ui.grid.GridCaption
 * @extends zebkit.ui.grid.BaseCaption
 */
export default class GridCaption extends BaseCaption {
    constructor() {
        this.defYAlignment = this.defXAlignment = "center";

        /**
         * Get a grid caption column or row title view
         * @param  {Integer} i a row (if the caption is vertical) or
         * column (if the caption is horizontal) index
         * @return {zebkit.ui.View} a view to be used as the given
         * row or column title view
         * @method getTitleView
         */
        this.getTitleView = function(i){
            var value = this.getTitle(i);
            if (value == null || value.paint != null) return value;
            this.render.setValue(value.toString());
            return this.render;
        };

        this.calcPreferredSize = function (l) {
            return { width:this.psW, height:this.psH };
        };

        this.setFont = function(f) {
            this.render.setFont(f);
        };

        this.setColor = function(c) {
            this.render.setColor(c);
        };

        this.recalc = function(){
            this.psW = this.psH = 0;
            if (this.metrics != null){
                var m     = this.metrics,
                    isHor = (this.orient === "horizontal"),
                    size  = isHor ? m.getGridCols() : m.getGridRows();

                for(var i = 0;i < size; i++) {
                    var v = this.getTitleView(i);
                    if (v != null) {
                        var ps = v.getPreferredSize();
                        if (isHor === true) {
                            if (ps.height > this.psH) this.psH = ps.height;
                            this.psW += ps.width;
                        } else {
                            if (ps.width > this.psW) this.psW = ps.width;
                            this.psH += ps.height;
                        }
                    }
                }

                if (this.psH === 0) this.psH = pkg.Grid.DEF_ROWHEIGHT;
                if (this.psW === 0) this.psW = pkg.Grid.DEF_COLWIDTH;
            }
        };

        this.getTitle = function(rowcol) {
            return this.titles[rowcol] == null ? null
                                               : this.titles[rowcol].title;
        };

        /**
         * Put the given title for the given caption cell.
         * @param  {Integer} rowcol a grid caption cell index
         * @param  {String|zebkit.ui.View|zebkit.ui.Panel} title a title of the given grid caption cell.
         * Can be a string or zebkit.ui.View or zebkit.ui.Panel class instance
         * @method putTitle
         */
        this.putTitle = function(rowcol, title){
            var prev = this.titles[rowcol] != null ? this.titles[rowcol] : {};
            if (prev.title != title) {
                if (title != null && zebkit.instanceOf(title, ui.Panel)) {
                    title = new ui.CompRender(title);
                }

                prev.title = title;
                this.titles[rowcol] = prev;
                this.vrp();
            }
        };

        this.setTitleAlignments = function(rowcol, xa, ya){
            var t = this.titles[rowcol];
            if (t == null || t.xa != xa || t.ya != ya) {
                if (t == null) t = {};
                t.xa = xa;
                t.ya = ya;
                this.titles[rowcol] = t;
                this.repaint();
            }
        };

        this.setTitleBackground = function(i, v) {
            v = ui.$view(v);
            var t = this.titles[i];
            if (t == null) t = {};
            t.bg = v;
            this.titles[i] = t;
            this.repaint();
        };

        this.getCaptionPS = function(rowcol) {
            var  v = this.getTitleView(rowcol);
            return (v != null) ? (this.orient === "horizontal" ? v.getPreferredSize().width
                                                               : v.getPreferredSize().height)
                               : 0;
        };
    },

    function paintOnTop(g) {
        if (this.metrics != null){
            var cv = this.metrics.getCellsVisibility();

            if ((cv.fc != null && cv.lc != null && this.orient === "horizontal")||
                (cv.fr != null && cv.lr != null && this.orient === "vertical"  )   )
            {
                var m      = this.metrics,
                    isHor  = (this.orient === "horizontal"),
                    gap    = m.lineSize,
                    top    = this.getTop(),
                    left   = this.getLeft(),
                    bottom = this.getBottom(),
                    right  = this.getRight();

                var x = isHor ? cv.fc[1] - this.x + m.getXOrigin() - gap
                              : left,
                    y = isHor ? top
                              : cv.fr[1] - this.y + m.getYOrigin() - gap,
                    size = isHor ? m.getGridCols()
                                 : m.getGridRows();

                //           top
                //           >|<
                //  +=========|===========================
                //  ||        |
                //  ||   +====|============+     +========
                //  ||   ||   |            ||   ||
                //  ||--------> left       ||   ||
                //  ||   ||<-------------->||   ||
                //  ||   ||       ww       ||   ||
                //  ||   ||                ||   ||
                // >-------< lineSize      ||   ||
                //  ||   ||                ||   ||
                //  x   first
                //      visible

                for(var i = (isHor ? cv.fc[0] : cv.fr[0]); i <= (isHor ? cv.lc[0] : cv.lr[0]); i++)
                {
                    var ww = isHor ? m.getColWidth(i)
                                   : this.width - left - right,
                        hh = isHor ? this.height - top - bottom
                                   : m.getRowHeight(i),
                        v = this.getTitleView(i);

                    if (v != null) {
                        var t  = this.titles[i],
                            xa = t != null && t.xa != null ? t.xa : this.defXAlignment,
                            ya = t != null && t.ya != null ? t.ya : this.defYAlignment,
                            bg = t == null ? null : t.bg,
                            ps = v.getPreferredSize(),
                            vx = xa === "center" ? Math.floor((ww - ps.width)/2)
                                                 : (xa === "right" ? ww - ps.width - ((i === size - 1) ? right : 0)
                                                                   : (i === 0 ? left: 0)),
                            vy = ya === "center" ? Math.floor((hh - ps.height)/2)
                                                 : (ya === "bottom" ? hh - ps.height - ((i === size - 1) ? bottom : 0)
                                                                    : (i === 0 ? top: 0));


                        if (bg != null) {
                            if (isHor) bg.paint(g, x, 0, ww + gap , this.height, this);
                            else       bg.paint(g, 0, y, this.width, hh + gap, this);
                        }

                        g.save();
                        g.clipRect(x + gap, y + gap, ww, hh);
                        v.paint(g, x + vx + gap, y + vy + gap, ps.width, ps.height, this);
                        g.restore();
                    }

                    if (isHor) x += ww + gap;
                    else       y += hh + gap;
                }
            }

            this.$super(g);
        }
    },

    function(titles, render) {
        if (arguments.length < 2) {
            render = new ui.StringRender("");
        }

        this.psW = this.psH = 0;
        this.titles = [];
        this.render = render;
        this.render.setFont(pkg.GridCaption.font);
        this.render.setColor(pkg.GridCaption.fontColor);
        this.$super(titles);
    }
}
