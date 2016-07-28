import Calendar from '../Calendar';
import DateTextField from './DateTextField';

class CalendarX extends Calendar {
    get clazz() {
        return {
            MonthsCombo: Calendar.MonthsCombo
        }
    }
}

function Clazz() {
    this.Button = Button;
    this.Calendar = CalendarX
    this.DateTextField = DateTextField;    
}

import Panel from '../../core/Panel';
import PopupCalendarMix from '../PopupCalendarMixin';
import * as layout from '../../../layout';

export default class DateInputField extends Panel, PopupCalendarMix {
    get clazz() {
        return new Clazz();
    }

    dateField: any;

    constructor(format) {
        super(new layout.FlowLayout());

        var $this = this;
        this.dateField = new this.clazz.DateTextField(format);
        this.add(this.dateField);
        this.add(new this.clazz.Button("..."));

        // sync calendar and input field dates
        this.dateField.setValue(this.getValue());

        this.find(".zebkit.ui.Button").bind(function(src) {
            $this.showCalendar($this.dateField);
        });
    }

    calendarDateSet(src) {
        this.dateField.setValue(src.selectedDate);
    }

    setValue(d) {
        this.getCalendar().setValue(d);
    }

    getValue(d) {
        return this.getCalendar().selectedDate;
    }
}