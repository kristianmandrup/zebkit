import Panel from '../core/Panel';
import { ListenersClass, Listeners } from '../../utils/listen';
import { Link, Label, ArrowButton } from '../';
import KeyEvent from '../web/keys/KeyEvent';
import TextField from '../field/TextField';
import { Combo, CompList } from '../list';
import DaysGrid from './DaysGrid';
import * as dates from './utils';

class MonthsCombo extends Combo {
    get clazz() {
        return {
            Label: Label,
            CompList: CompList
        }
    }

    constructor() {
        super(new this.clazz.CompList(true));
        this.button.removeMe();
    }
     
    setMonths(months) {
        for(var i = 0; i < months.length; i++) {
            this.list.model.add(new this.clazz.Label(months[i].name));
        }
    }

    padShown(b) {
        if (b === true) {
            this.list.position.setOffset(0);
        }
    }
}

class YearField extends TextField {
    fireNextYear: any;
    firePrevYear: any;

    keyPressed(e) {
        switch (e.code) {
            case KeyEvent.UP  : if (this.fireNextYear != null) this.fireNextYear(); break;
            case KeyEvent.DOWN: if (this.firePrevYear != null) this.firePrevYear(); break;
            default: return super.keyPressed(e);
        }
    }
}

class DotButton extends ui.EvStatePan, ui.ButtonRepeatMix {
    constructor() {
        super();
        this._ = new Listeners();
    }
}



function Clazz() {
        this.Listeners = ListenersClass("dateSet");

        this.LeftArrowButton   = ArrowButton;
        this.TopArrowButton    = ArrowButton;
        this.BottomArrowButton = ArrowButton;
        this.RightArrowButton  = ArrowButton;
        this.Link              = Link;

        this.DotButton = DotButton;

        this.MonthsCombo = MonthsCombo; 
        this.YearField = YearField;

        this.InfoPan = Panel;

}

import * as layout from '../../layout';

export default class Calendar extends Panel {
    get clazz() {
        return new Clazz();
    }

    comboMonth: any;
    monthDaysGrid: any;
    selectedDate: any;
    minDate: any;
    maxDate: any;
    yearText: string;
    showMonth: any;

    protected $freeze: boolean;

    constructor(date) {
        super(new layout.BorderLayout());

        this.comboMonth = this.monthDaysGrid = null;
        this.selectedDate = this.minDate = this.maxDate = null;
        this.$freeze = false;
    
        if (date == null) date = new Date();

        var $this = this;

        
        this.monthDaysGrid = new DaysGrid([
            function isItemSelectable(item) {
                return (item.tags.length > 0 && item.hasTag("shownMonth") == null) ||
                        $this.canDateBeSet(new Date(item.year, item.month, item.day));
            }

        ]);
        this.monthDaysGrid.bind(this);

        this._ = new this.clazz.Listeners();

        this.comboMonth = new this.clazz.MonthsCombo();
        this.comboMonth.content.setCalcPsByContent(true);
        this.comboMonth.winpad.adjustToComboSize = false;
        this.comboMonth.bind(function(src) {
            $this.showMonth(src.list.selectedIndex, $this.monthDaysGrid.year);
        });

        this.yearText = new this.clazz.YearField("", [
            function fireNextYear() {
                $this.showNextYear();
            },

            function firePrevYear() {
                $this.showPrevYear();
            }
        ]);

        var topPan = new this.clazz.InfoPan({
            layout: new layout.BorderLayout(),
            kids  : {
                center: new Panel({
                    layout : new layout.FlowLayout('center', 'center'),
                    kids   : [
                        this.comboMonth,
                        new Panel({
                            layout : new layout.BorderLayout(),
                            kids   : {
                                center : this.yearText,
                                right  : new Panel({
                                    layout: new layout.FlowLayout('center', 'center', 'vertical', 1),
                                    kids  : [
                                        new this.clazz.TopArrowButton(),
                                        new this.clazz.BottomArrowButton()
                                    ]
                                })
                            }
                        })
                    ]
                }),

                left: new Panel({
                    layout : new layout.FlowLayout('center', 'center', 'horizontal', 3),
                    kids   : [
                        new this.clazz.LeftArrowButton(),
                        new this.clazz.DotButton(),
                        new this.clazz.RightArrowButton()
                    ]
                }),

                right: new Panel({
                    layout : new layout.FlowLayout('center', 'bottom'),
                    kids   : new this.clazz.Link('today'),
                    padding: [0,8,4,0]
                })
            }
        });

        this.add("top", topPan);
        this.add("center", this.monthDaysGrid);
        this.setValue(date);

        this.find("#dotButton").bind(function() {
            $this.showSelectedMonth();
        });

        this.find("#leftButton").bind(function() {
            $this.showPrevMonth();
        });

        this.find("#rightButton").bind(function() {
            $this.showNextMonth();
        });

        this.find("#topButton").bind(function() {
            $this.showNextYear();
        });

        this.find("#bottomButton").bind(function() {
            $this.showPrevYear();
        });

        this.find("#nowLink").bind(function() {
            $this.setValue(new Date());
        });        
    }

    canMonthBeShown(month, year) {
        return true;
    }

    showMonth(month, year) {
        dates.validateDate(month, year);
        if (this.canMonthBeShown(month, year)) {
            this.monthDaysGrid.setValue(month, year);
        }
    }

    monthShown(src, prevMonth, prevYear) {
        if (this.selectedDate != null &&
            this.selectedDate.getMonth() == src.month &&
            this.selectedDate.getFullYear() == src.year)
        {
            src.selectCell(this.selectedDate, true);
        }

        this.comboMonth.select(src.month);
        this.yearText.setValue("" + src.year);
        this.repaint();
    }

    showNextYear() {
        this.showMonth(this.monthDaysGrid.month, this.monthDaysGrid.year + 1);
    }

    showPrevYear() {
        this.showMonth(this.monthDaysGrid.month, this.monthDaysGrid.year - 1);
    }

    showNextMonth() {
        if (this.monthDaysGrid.month < 0) {
            this.showMonth(0, 1900);
        }
        else {
            var d = new Date(this.monthDaysGrid.year,
                                this.monthDaysGrid.month).nextMonth();
            this.showMonth(d.getMonth(), d.getFullYear());
        }
    }

    showPrevMonth() {
        if (this.showMonth < 0) {
            this.showMonth(0, 1900);
        }
        else {
            var d = new Date(this.monthDaysGrid.year, this.monthDaysGrid.month).prevMonth();
            this.showMonth(d.getMonth(), d.getFullYear());
        }
    }

    showSelectedMonth() {
        if (this.selectedDate != null) {
            this.showMonth(this.selectedDate.getMonth(),
                            this.selectedDate.getFullYear());
        }
    }

    canDateBeSet(date) {
        return  date == null || (
                    (this.minDate == null || pkg.compareDates(date, this.minDate) >= 0) &&
                    (this.maxDate == null || pkg.compareDates(date, this.maxDate) <= 0)
                );
    }

    cellSelected(src, offset, b) {
        if (this.$freeze !== true && b === true) {
            var item = src.model.geti(offset);
            if (item.tags.length > 0) {
                if (item.hasTag("shownMonth") === true) {
                    this.setValue(item.day, item.month, item.year);
                }
                else {
                    if (item.hasTag("nextMonth")  === true) {
                        this.showNextMonth();
                    }
                    else {
                        this.showPrevMonth();
                    }
                }
            }
        }
    };

    setMinValue(date) {
        if (arguments.length > 1) {
            date = new Date(arguments[2], arguments[1], arguments[0]);
        }

        if (date != null) dates.validateDate(date);

        if (dates.compareDates(this.minDate, date) !== 0) {
            if (dates.compareDates(date, this.maxDate) === 1) {
                throw new RangeError();
            }

            this.minDate = date;
            if (dates.compareDates(this.selectedDate, this.minDate) === -1) {
                this.setValue(null);
            }

            this.monthDaysGrid.retagModel();
        }
    }

    setMaxValue(date) {
        if (arguments.length > 1) {
            date = new Date(arguments[2], arguments[1], arguments[0]);
        }

        if (date != null) dates.validateDate(date);

        if (dates.compareDates(this.maxDate, date) !== 0) {
            if (dates.compareDates(date, this.minDate) === -1) {
                throw new RangeError("" + date + "," + this.minDate + "," + dates.compareDates(date, this.minDate));
            }

            this.maxDate = date;
            if (dates.compareDates(this.selectedDate, this.maxDate) === 1) {
                this.setValue(null);
            }

            this.monthDaysGrid.retagModel();
        }
    }

    setValue(date) {
        if (arguments.length > 1) {
            date = new Date(arguments[2], arguments[1], arguments[0]);
        }

        if (this.$freeze !== true) {
            if (date != null) {
                dates.validateDate(date);
            }

            if (this.canDateBeSet(date) === true && dates.compareDates(this.selectedDate, date) !== 0) {
                try {
                    this.$freeze = true;

                    var prevDate = this.selectedDate;
                    if (prevDate != null                                 &&
                        prevDate.getMonth() === this.monthDaysGrid.month  &&
                        prevDate.getFullYear() === this.monthDaysGrid.year  )
                    {
                        this.monthDaysGrid.selectCell(this.selectedDate, false);
                    }

                    this.selectedDate = date;
                    this.find("#dotButton").setEnabled(this.selectedDate != null);
                    this.find("#nowLink").setEnabled(pkg.compareDates(new Date(), this.selectedDate) !== 0);

                    if (this.selectedDate != null) {
                        this.showSelectedMonth();
                        this.monthDaysGrid.selectCell(this.selectedDate, true);
                    }

                    this.monthDaysGrid.retagModel();
                    this._.dateSet(this, prevDate);
                }
                finally {
                    this.$freeze = false;
                }
            }
        }
    }
}
