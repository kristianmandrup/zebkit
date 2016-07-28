import Panel from '../../core/Panel';

function Clazz() {
    this.MinDateTextField  = Class(pkg.DateTextField, []);
    this.MaxDateTextField  = Class(pkg.DateTextField, []);
    this.LeftArrowButton   = Class(ui.ArrowButton, []);
    this.RightArrowButton  = Class(ui.ArrowButton, []);

    this.DateInputPan = Class(ui.Panel, [
        function() {
            this.$super();
            for(var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
        }
    ]);

    this.Line = Class(ui.Line, []);    
}

import PopupCalendarMix from '../PopupCalendarMixin';
import KeyEvent from '../../web/keys/KeyEvent';
import * as dates from '../utils'; 

export default class DateRangeInput extends Panel, PopupCalendarMix {
    get $clazz() {
        return new Clazz();
    }

    minDateField: any;
    maxDateField: any;

    constructor() {
        super();

        var $this = this,
            la    = new this.clazz.LeftArrowButton(),
            ra    = new this.clazz.RightArrowButton(),
            cal   = this.getCalendar();

        this._ = new Listeners();

        this.minDateField = new this.clazz.MinDateTextField([
            function keyPressed(e) {
                if (e.code === KeyEvent.RIGHT && this.position.offset === this.getMaxOffset()) {
                    $this.maxDateField.position.setOffset(0);
                    $this.maxDateField.requestFocus();
                }
                this.$super(e);
            }
        ]);

        this.maxDateField = new this.clazz.MaxDateTextField([
            function keyPressed(e) {
                if (e.code === KeyEvent.LEFT && this.position.offset === 0) {
                    $this.minDateField.requestFocus();
                }
                this.$super(e);
            }
        ]);

        cal.monthDaysGrid.setTagger({
            tag : function(item) {
                if (dates.compareDates(item.day, item.month, item.year, $this.minDateField.date) === 0) {
                    item.tag("startDate");
                }
                else {
                    if (dates.compareDates(item.day, item.month, item.year, $this.maxDateField.date) === 0) {
                        item.tag("endDate");
                    }
                }
            }
        });

        if (this.clazz.tags != null) {
            cal.monthDaysGrid.addTags(this.clazz.tags);
        }

        this.add(new this.clazz.DateInputPan(la, this.minDateField));
        this.add(new this.clazz.Line());
        this.add(new this.clazz.DateInputPan(this.maxDateField, ra));

        la.bind(function () {
            $this.getCalendar().setMaxValue($this.maxDateField.date);
            $this.showCalendar($this.minDateField);
        });

        ra.bind(function () {
            $this.getCalendar().setMinValue($this.minDateField.date);
            $this.showCalendar($this.maxDateField);
        });
    }

    calendarShown(calendar) {
        if (this.anchor === this.minDateField) {
            calendar.setValue(this.minDateField.date);
            calendar.setMaxValue(this.maxDateField.date);
            calendar.setMinValue(null);
        }
        else {
            calendar.setValue(this.maxDateField.date);
            calendar.setMaxValue(null);
            calendar.setMinValue(this.minDateField.date);
        }
    }

    calendarDateSet(src) {
        this.setValue(this.anchor === this.minDateField ? src.selectedDate : this.minDateField.date,
                        this.anchor === this.maxDateField ? src.selectedDate : this.maxDateField.date);
    }

    setValue(d1, d2) {
        if (dates.compareDates(d1, d2) === 1) {
            throw new RangeError();
        }

        if (dates.compareDates(d1, this.minDateField.date) !== 0 ||
            dates.compareDates(d2, this.maxDateField.date) !== 0   )
        {
            var prev = this.getValue();
            this.minDateField.setValue(d1);
            this.maxDateField.setValue(d2);

            this.getCalendar().monthDaysGrid.retagModel();

            this._.fired(this, prev);
        }
    }

    getValue() {
        return  {
            min : this.minDateField.date,
            max : this.maxDateField.date
        };
    }

    loadConfig() {
        ui.load(pkg.$url + "ui.date.json", function(e) {
            if (e != null) {
                console.log("" + (e.stack ? e.stack : e));
            }
        });
    } 
}