/**
 * Virtual keyboard implementation
 * @module  ui.vk
 * @main
 */
import Layout from '../../layout/Layout';

export default class VKLayout extends Layout {
    ratio: number;
    gap: number;
    
    constructor() {
        super();

        this.ratio = this.gap = 2;
    }

    doLayout(t) {
        var m     =  this.keyboardMetrics(t),
            rows  =  m.rows,
            row   = -1,
            x     =  0,
            y     =  0,
            left  =  t.getLeft(),
            top   =  t.getTop(),
            ew    =  t.width - left - t.getRight(),
            extra =  1000000;

        // compute extra alignment for fixed size keys to
        // take larger than preferred size horizontal
        // space
        for(var i = 0; i < rows.length; i++) {
            if (rows[i].fixKeys !== 0) {
                var r  = rows[i],
                    w  = (r.keys > 0 ? r.keys - 1 : 0) * this.gap + m.fixKeyWidth * r.fixKeys + r.occupiedHorSpace,
                    ex = ew - w;

                ex =  Math.round(ex/r.fixKeys);
                if (extra > ex) {
                    extra = ex;
                }
            }
        }

        // calculate final fixed size key size
        if (extra != 1000000 && extra != 0) {
            m.fixKeyWidth += extra;

            // check if key proportion is good, otherwise again correct fixed key size
            if (m.fixKeyWidth / m.rowHeight > this.ratio) {
                m.fixKeyWidth = Math.floor(m.rowHeight * this.ratio);
            }

            // re-calculate keyboard width
            m.width = this.maxRowWidth(rows, m.fixKeyWidth);
        }

        for (var i = 0; i < t.kids.length; i++) {
            var k = t.kids[i], ctr = k.constraints, r = m.rows[ctr.row];

            if (row != ctr.row) {
                row ++;
                y += (row === 0 ? top : this.gap + m.rowHeight);

                // compute actual width the row occupies
                var aw = r.fixKeys * m.fixKeyWidth + r.occupiedHorSpace + (r.keys > 0 ? r.keys - 1 : 0) * this.gap;

                if (r.stretchedKeys === 0) {
                    x = left + Math.floor((ew - aw) / 2);
                }
                else {
                    x  = left + Math.floor((ew - m.width) / 2)
                    extra = Math.floor((m.width - aw) / r.stretchedKeys);
                }
            }

            if (k.isVisible === true) {
                if (ctr.size == null) {
                    k.setSize(m.fixKeyWidth, m.rowHeight);
                }
                else {
                    var ps = k.getPreferredSize();
                    if (ctr.size === "stretched") {
                        k.setSize(ps.width + extra, m.rowHeight);
                    }
                    else {
                        k.setSize(ps.width, m.rowHeight);
                    }
                }

                k.setLocation(x, y);
                x += this.gap + k.width;
            }
        }
    }

    calcPreferredSize(t) {
        var m = this.keyboardMetrics(t);
        return {
            width : m.width,
            height: m.height
        };
    };

    maxRowWidth(rows, fixKeyWidth) {
        // calculate preferred size
        var width = 0;
        for(var i = 0; i < rows.length; i++) {
            var r    = rows[i],
                w    = (r.keys > 0 ? r.keys - 1 : 0) * this.gap + fixKeyWidth * r.fixKeys + r.occupiedHorSpace;
            if (w > width) width = w;
        }
        return width;
    }

    keyboardMetrics(t) {
        var rows             = [],
            rowHeight        = 0,
            fixKeyWidth      = 0;

        for(var row = 0;  ;row++) {
            var r = this.rowMetric(row, t);
            if (r == null) break;

            rows.push(r);
            if (r.fixKeyMaxWidth > fixKeyWidth) fixKeyWidth = r.fixKeyMaxWidth;
            if (r.rowHeight      > rowHeight  ) rowHeight   = r.rowHeight;
        }

        // check if key proportion is good, otherwise again correct fixed key size
        if (fixKeyWidth / rowHeight > this.ratio) {
            fixKeyWidth = Math.floor(rowHeight * this.ratio);
        }

        return {
            rows         : rows,
            rowHeight    : rowHeight,
            fixKeyWidth  : fixKeyWidth,
            width        : this.maxRowWidth(rows, fixKeyWidth),
            height       : rows.length * rowHeight + (rows.length > 0 ? rows.length - 1 : 0) * this.gap
        };
    }

    rowMetric(row, t) {
        var fixKeys           = 0,
            prefKeys          = 0,
            stretchedKeys     = 0,
            fixKeyMaxWidth    = 0,
            occupiedHorSpace  = 0,
            rowHeight         = 0,
            stretchedHorSpace = 0,
            ctr               = null;

        for (var i=0; i < t.kids.length; i++) {
            var k = t.kids[i];

            ctr = k.constraints;

            // next row detected
            if (ctr.row > row) {
                break;
            }

            if (ctr.row === row && k.isVisible === true) {
                var ps = k.getPreferredSize();

                if (ctr.size == null) {
                    if (fixKeyMaxWidth < ps.width) fixKeyMaxWidth = ps.width;
                    fixKeys ++;
                }
                else {
                    if (ctr.size === "ps") {
                        prefKeys++;
                    }
                    else {
                        stretchedKeys++;
                        stretchedHorSpace += ps.width;
                    }
                    occupiedHorSpace += ps.width;
                }

                if (rowHeight < ps.height) rowHeight = ps.height;
            }
        }

        // no row exists
        if (ctr == null || ctr.row < row) {
            return null;
        }

        return {
            keys             : fixKeys + prefKeys + stretchedKeys,
            fixKeys          : fixKeys,
            prefKeys         : prefKeys,
            stretchedKeys    : stretchedKeys,
            rowHeight        : rowHeight,
            fixKeyMaxWidth   : fixKeyMaxWidth,
            occupiedHorSpace : occupiedHorSpace,
            stretchedHorSpace: stretchedHorSpace
        };
    }
}