/**
 *  Shows the given month and year days.
 *  @constructor
 *  @class zebkit.ui.date.DaysGrid
 *  @extends {zebkit.ui.grid.Grid}
 */

function Clazz() {
        this.Item = function() {
            this.tags    = [];
            this.$exists = {};
            this.day = this.month = this.year = 0;
        };

        this.Item.prototype = {
            set : function(day, month, year) {
                this.day   = day;
                this.month = month;
                this.year  = year;
            },

            tag : function(tag) {
                if (tag == null) throw new Error();

                if (this.hasTag(tag) === false) {
                    this.tags.push(tag);
                    this.$exists[tag] = this.tags.length - 1;
                    return true;
                }
                return false;
            },

            untag : function(tag) {
                if (tag == null) throw new Error();

                if (this.hasTag(tag) === true) {
                    var i = this.$exists[tag];
                    this.tags.splice(i, 1);
                    for(; i < this.tags.length; i++) {
                        this.$exists[tag]--;
                    }
                    return true;
                }
                return false;
            },

            hasTag : function(tag) {
                return this.$exists[tag] >= 0;
            },

            untagAll : function() {
                if (this.tags.length > 0) {
                    this.tags.length = 0;
                    this.tags        = [];
                    this.$exists     = {};
                }
            }
        };

        this.ItemPan = Class(ui.Panel, [
            function $prototype() {
                this.setLabel = function(p) {
                    this.label.properties(p);
                };

                this.setColor = function(c) {
                    this.label.setColor(c);
                };

                this.setFont = function(f) {
                    this.label.setFont(f);
                };

                this.setValue = function(v) {
                    this.label.setValue("" + v);
                };

                this.setIconView = function(v) {
                    this.icon.setView(v);
                };

                this.setIcon = function(p) {
                    this.icon.properties(p);
                };

                this.setTextDecorations = function(d) {
                    this.label.view.setDecorations(d);
                };
            },

            function () {
                this.icon  = new ui.ViewPan();
                this.label = new ui.Label(new ui.DecoratedTextRender(""));
                this.$super();
                this.add(this.icon);
                this.add(this.label);
            }
        ]);

        this.Listeners = this.$parent.Listeners.ListenersClass("cellSelected", "monthShown");

        var GridCaption = this.GridCaption = Class(ui.grid.GridCaption, [
            function $clazz() {
                this.Label = Class(ui.Label, [
                    function setNickname(name) {
                        return this.setValue(name);
                    }
                ]);
            },

            function $prototype() {
                this.setNamesOfWeekDays = function(daysOfWeek) {
                    for(var i = 0; i < daysOfWeek.length; i++) {
                        this.putTitle(i, new this.clazz.Label().properties(daysOfWeek[i]));
                    }
                };
            }
        ]);    
}

import Grid from '../grid/Grid';
import { CompRender } from '../views';
import * as utils from './utils';
import KeyEvent from '../web/keys/KeyEvent';

export default class DaysGrid extends Grid {
    get clazz() {
        return new Clazz();
    }

    tags: any;
    tagger: any;
    view: any; // View
    views: any[];
    itemPan: any;
    model: any;
    caption: any; //Caption
    year: number;
    month: number;
    position: any;

    constructor() {
        super(6, 7);
        this.tags    = {};
        this.tagger  = null;
        this.view    = new CompRender(null);
        this.itemPan = new this.clazz.ItemPan();

        

        //  pre-fill model with data
        for(var i = 0; i < this.model.rows * this.model.cols; i++) {
            this.model.puti(i, new this.clazz.Item());
        }

        this.setViewProvider(this);
        this.caption = new this.clazz.GridCaption();
        this.add("top", this.caption);
    }        

    retagModel() {
        for(var i = 0; i < this.model.rows * this.model.cols; i++) {
            var item = this.model.geti(i);
            item.untagAll();

            if (item.year < this.year || (item.year === this.year && item.month < this.month)) {
                item.tag("prevMonth");
            }
            else {
                if (item.year > this.year || (item.year === this.year && item.month > this.month)) {
                    item.tag("nextMonth");
                }
                else {
                    item.tag("shownMonth");
                }
            }

            if (this.isItemSelectable(item) === false) {
                item.tag("notSelectable");
            }

            if (this.tagger != null) {
                this.tagger.tag(item);
            }
        }

        var i = this.indexOfItem(new Date());
        if (i > 0) {
            this.model.geti(i).tag("today");
        }

        this.vrp();
    }

    setValue(month, year) {
        if (arguments.length === 1) {
            year  = month.getFullYear();
            month = month.getMonth();
        }

        utils.validateDate(month, year);

        if (this.month != month || this.year != year) {
            var prevYear  = this.year,
                prevMonth = this.month;

            this.month = month;
            this.year  = year;

            if (prevMonth >= 0) {
                this.clearCellsSelection();
            }

            var date         = new Date(this.year, this.month),
                firstWeekDay = date.firstWeekDay(),
                pdate        = date.prevMonth(),
                ndate        = date.nextMonth(),
                pdays        = pdate.daysInMonth(),
                i            = 0,
                d            = 0;

            // if current month starts from the first cell
            // shift one week ahead to shown number of
            // previous month days
            if (firstWeekDay === 0) {
                firstWeekDay += 7;
            }

            for(; i < firstWeekDay; i++) {
                this.model.geti(i).set(
                    pdays - firstWeekDay + i + 1,
                    pdate.getMonth(),
                    pdate.getFullYear()
                );
            }

            for(d = 1; d <= date.daysInMonth(); i++, d++) {
                this.model.geti(i).set(d, month, year);
            }

            for(d = 1; i < this.model.rows * this.model.cols; i++, d++) {
                this.model.geti(i).set(d, ndate.getMonth(), ndate.getFullYear());
            }

            this.retagModel();
            this._.monthShown(this, prevMonth, prevYear);
        }
    }

    getCellColor(grid, row, col) {
        var color = null,
            item  = grid.model.get(row, col),
            tags  = grid.tags;

        if (tags.length > 0) {
            for(var i = 0; i < tags.length; i++) {
                var k = tags[i];
                if (this.tags[k] != null) {
                    color = this.tags[k].cellColor;
                }
            }
        }
        return color;
    }

    getViewComponent(item) {
        this.itemPan.properties(this.itemPan.clazz);

        if (item.tags.length > 0) {
            for(var i = 0; i < item.tags.length; i++) {
                var k = item.tags[i];
                if (this.tags[k] != null) {
                    this.itemPan.properties(this.tags[k]);
                }
            }
        }

        this.itemPan.setValue(item.day);
        return this.itemPan;
    }

    getView(grid, row, col, data) {
        this.view.setTarget(this.getViewComponent(data));
        return this.view;
    }

    isItemSelectable(item) {
        return true;
    }

    isSelected(row, col) {
        return row >= 0 && col >= 0 && this.model.get(row, col).isSelected;
    }

    indexOfItem(day, month, year) {
        if (arguments.length === 1) {
            month = day.getMonth();
            year  = day.getFullYear();
            day   = day.getDate();
        }

        var m = this.model.rows * this.model.cols;
        for(var i = 0; i < m; i++) {
            var item = this.model.geti(i);
            if (item.year == year && item.day == day && item.month == month) {
                return i;
            }
        }
        return -1;
    }

    pointerMoved(e) {
        var p = this.cellByLocation(e.x, e.y);
        if (p != null) {
            this.position.setRowCol(p.row, p.col);
        }
        else {
            this.position.setOffset(null);
        }
    }

    clearCellsSelection() {
        for(var i = 0;  i < this.model.rows * this.model.cols; i++) {
            var item = this.model.geti(i);
            if (item.isSelected === true) {
                this.selectCell(i, false);
            }
        }
    }

    pointerExited(e) {
        this.position.setOffset(null);
    }

    setTagger(tagger) {
        if (this.tagger != tagger) {
            this.tagger = tagger;
            this.retagModel();
        }
    }

    setTags(tags) {
        this.tags = zebkit.clone(tags);
        this.vrp();

    }

    addTags(tags) {
        for(var k in tags) {
            this.tags[k] = zebkit.clone(tags[k]);
        }
        this.vrp();
    }

    setTag(tag, p) {
        this.tags[tag] = zebkit.clone(p);
        this.vrp();
    }

    selectCell(offset, b) {
        if (arguments.length > 2) {
            offset = this.indexOfItem(arguments[0], arguments[1], arguments[2]);
            b = arguments[3];
        }

        if (offset == null) {
            throw new Error("" + offset);
        }

        if (offset instanceof Date) {
            offset = this.indexOfItem(offset);
        }

        var item = this.model.geti(offset);
        if (item.isSelected != b && (b === false || this.isItemSelectable(item))) {
            item.isSelected = b;
            this.repaint();
            this._.cellSelected(this, offset, b);
        }
    }

    rPsMetric() {
        super.rPsMetric();

        var max = 0, cols = this.getGridCols();
        for(var i = 0; i < cols; i++) {
            if (this.colWidths[i] > max) max = this.colWidths[i];
        }

        for(var i = 0; i < cols; i++) {
            this.colWidths[i] = max;
        }
    }

    $getPosMarker() {
        var item = this.model.geti(this.position.offset);
        return this.isItemSelectable(item) === false ? this.views.notSelectableMarker
                                                      : super.$getPosMarker();
    }

    pointerClicked(e) {
        super.pointerClicked(e);
        var p = this.cellByLocation(e.x, e.y);
        if (p != null) {
            this.selectCell(p.row * this.getGridCols() + p.col, true);
        }
    }

    keyPressed(e) {
        if (e.code != KeyEvent.ENTER) {
            return super.keyPressed(e);
        }

        if (this.position.offset >= 0) {
            this.selectCell(this.position.offset, true);
        }
    }
}

