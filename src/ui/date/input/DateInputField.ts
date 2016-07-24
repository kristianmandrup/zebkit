class DateInputField extends ui.Panel, PopupCalendarMix {
    function $clazz() {
        this.Button = Class(ui.Button, []);

        this.Calendar = Class(pkg.Calendar, [
            function $clazz() {
                this.MonthsCombo = Class(pkg.Calendar.MonthsCombo, []);
            }
        ]);

        this.DateTextField = Class(pkg.DateTextField, []);
    },

    function calendarDateSet(src) {
        this.dateField.setValue(src.selectedDate);
    },

    function setValue(d) {
        this.getCalendar().setValue(d);
    },

    function getValue(d) {
        return this.getCalendar().selectedDate;
    },

    function (format) {
        this.$super(new zebkit.layout.FlowLayout());

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
}