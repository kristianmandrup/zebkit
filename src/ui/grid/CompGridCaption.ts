import BaseCaption from './BaseCaption';

export class LeftCompGridCaption extends CompGridCaption {
    constructor() {
        super();
        this.constraints = "left";
    }
}

function Clazz() {
        this.Layout = class extends Layout {
            constructor() {
                this.doLayout = function (target) {
                    var m    = target.metrics,
                        b    = target.orient === "horizontal",
                        top  = target.getTop(),
                        left = target.getLeft(),
                        wh   = (b ? target.height - top  - target.getBottom()
                                  : target.width  - left - target.getRight());
                        xy   = (b ? left + m.getXOrigin()
                                  : top  + m.getYOrigin());

                    for(var i=0; i < target.kids.length; i++) {
                        var kid = target.kids[i],
                            cwh = (b ? m.getColWidth(i) : m.getRowHeight(i));// + m.lineSize;

                        if (i === 0) {
                            cwh -= (b ? (left - m.lineSize) : top);
                        }

                        if (kid.isVisible === true) {
                            if (b) {
                                kid.setBounds(xy, top, cwh, wh);
                            } else {
                                kid.setBounds(left, xy, wh, cwh);
                            }
                        }

                        xy += ( cwh + m.lineSize );
                    }
                };

                this.calcPreferredSize = function (target) {
                    return zebkit.layout.getMaxPreferredSize(target);
                };
            }
        ]);

        this.Link = Class(ui.Link, []);

        this.StatusPan = Class(ui.StatePan, []);

        /**
         * Title panel that is designed to be used as
         * CompGridCaption UI component title element.
         * The panel keeps a grid column or row title,
         * a column or row sort indicator. Using the
         * component you can have sortable grid columns.
         * @constructor
         * @param {String} a grid column or row title
         * @class zebkit.ui.grid.CompGridCaption.TitlePan
         */
        var clazz = this;
        this.TitlePan = Class(ui.Panel, [
            function $clazz() {
                this.layout = new zebkit.layout.FlowLayout("center", "center", "horizontal", 8);
            },

            function $prototype() {
                this.sortState = 0;

                /**
                 * Indicates if the title panel has to initiate a column sorting
                 * @default false
                 * @attribute isSortable
                 * @readOnly
                 * @type {Boolean}
                 */
                this.isSortable = false;
            },

            function getGridCaption() {
                var c = this.parent;
                while(c != null && zebkit.instanceOf(c, pkg.BaseCaption) === false) {
                    c = c.parent;
                }
                return c;
            },

            function matrixSorted(target, info) {
                if (this.isSortable) {
                    var col = this.parent.indexOf(this);
                    if (info.col === col) {
                        this.sortState = info.name === 'descent' ? 1 : -1;
                        this.statusPan.setState(info.name);
                    } else {
                        this.sortState = 0;
                        this.statusPan.setState("*");
                    }
                }
            },

            /**
             * Set the caption icon
             * @param {String|Image} path a path to an image or image object
             * @method setIcon
             */
            function setIcon(path) {
                this.iconPan.setImage(path);
                return this;
            },

            function matrixResized(target,prevRows,prevCols){
                if (this.isSortable) {
                    this.sortState = 0;
                    this.statusPan.setState("*");
                }
            },

            function fired(target) {
                if (this.isSortable === true) {
                    var f = this.sortState === 1 ? zebkit.data.ascent
                                                 : zebkit.data.descent,
                        model = this.getGridCaption().metrics.model,
                        col   = this.parent.indexOf(this);
                    model.sortCol(col, f);
                }
            },

            function kidRemoved(index, kid) {
                // TODO: not very prefect check
                if (kid._ != null && kid._.fired != null) {
                    kid.unbind(this);
                }
                this.$super(index, kid);
            },

            function kidAdded(index, constr, kid) {
                // TODO: not very prefect check
                if (kid._ != null && kid._.fired != null) {
                    kid.bind(this);
                }
                this.$super(index, constr, kid);
            },

            function(title) {
                this.$super();

                /**
                 * Image panel to keep grtid caption title
                 * @attribute iconPan
                 * @type {zebkit.ui.ImagePan}
                 * @readOnly
                 */
                this.iconPan = new ui.ImagePan(null);

                /**
                 * Title link
                 * @attribute link
                 * @type {zebkit.ui.Link}
                 * @readOnly
                 */
                this.link = new clazz.Link(title);
                this.statusPan = new clazz.StatusPan();
                this.statusPan.setVisible(this.isSortable);

                this.add(this.iconPan);
                this.add(this.link);
                this.add(this.statusPan);
            }
        ]);
}

/**
 * Grid caption class that implements component based caption.
 * Component based caption uses other UI component as the
 * caption titles.
 * @param  {Array} a caption titles. Title can be a string or
 * a zebkit.ui.Panel class instance
 * @constructor
 * @class zebkit.ui.grid.CompGridCaption
 * @extends zebkit.ui.grid.BaseCaption
 */
import { types } from '../../utils';

export class CompGridCaption extends BaseCaption {
    get clazz(clazz) {
        return new Clazz();
    }

    /**
     * @for zebkit.ui.grid.CompGridCaption
     */
    kids: any[];
    parent: any;
    orient: string;

    constructor(titles = null) {
        super(titles);        
        this.setLayout(new this.clazz.Layout());
    }

    catchInput(t) {
        // TODO: not very perfect check
        return t._ == null || t._.fired == null;
    };

    scrolled() {
        this.vrp();
    };

    /**
     * Put the given title component for the given caption cell.
     * @param  {Integer} rowcol a grid caption cell index
     * @param  {String|zebkit.ui.Panel|zebkit.ui.View} title a title of the given grid caption cell.
     * Can be a string or zebkit.ui.View or zebkit.ui.Panel class instance
     * @method putTitle
     */
    putTitle(rowcol, t) {
        // add empty titles
        for(var i = this.kids.length - 1;  i >= 0 && i < rowcol; i++) {
            this.add(new this.clazz.TitlePan(""));
        }

        if (types.isString(t)) {
            t = new this.clazz.TitlePan(t);
        } else {
            if (types.instanceOf(t, ui.View)) {
                var p = new ui.ViewPan();
                p.setView(t);
                t = p;
            }
        }

        if (rowcol < this.kids.length) {
            this.setAt(rowcol, t);
        } else {
            this.add(t);
        }
    };

    /**
     * Set the given column sortable state
     * @param {Integer} col a column
     * @param {Boolean} b true if the column has to be sortable
     * @method setSortable
     */
    setSortable(col, b) {
        var c = this.kids[col];
        if (c.isSortable != b) {
            c.isSortable = b;
            c.statusPan.setVisible(b);
        }
        return this;
    };

    matrixSorted(target, info) {
        for(var i=0; i < this.kids.length; i++) {
            if (this.kids[i].matrixSorted) {
                this.kids[i].matrixSorted(target, info);
            }
        }
    };

    matrixResized(target,prevRows,prevCols){
        for(var i = 0; i < this.kids.length; i++) {
            if (this.kids[i].matrixResized) {
                this.kids[i].matrixResized(target,prevRows,prevCols);
            }
        }
    };

    getCaptionPS(rowcol) {
        var  c = this.kids[rowcol];
        return (c != null) ? (this.orient === "horizontal" ? c.getPreferredSize().width
                                                            : c.getPreferredSize().height)
                            : 0;
    };

    captionResized(rowcol, ns) {
        super.captionResized(rowcol, ns);
        this.vrp();
    }

    setParent(p) {
        if (this.parent != null && this.parent.scrollManager != null) {
            this.parent.scrollManager.unbind(this);
        }

        if (p != null && p.scrollManager != null) {
            p.scrollManager.bind(this);
        }

        super.setParent(p);
    }

    insert(i,constr, c) {
        if (types.isString(c)) {
            c = new this.clazz.TitlePan(c);
        }
        super.insert(i,constr, c);
    }
}
