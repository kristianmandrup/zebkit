class Calendar extends ui.Panel {
    function $clazz() {
        this.Listeners = zebkit.util.ListenersClass("dateSet");

        this.LeftArrowButton   = Class(ui.ArrowButton, []);
        this.TopArrowButton    = Class(ui.ArrowButton, []);
        this.BottomArrowButton = Class(ui.ArrowButton, []);
        this.RightArrowButton  = Class(ui.ArrowButton, []);
        this.Link              = Class(ui.Link, []);

        this.DotButton = Class(ui.EvStatePan, ui.ButtonRepeatMix, [
            function() {
                this._ = new zebkit.util.Listeners();
                this.$super();
            }
        ]);

        this.MonthsCombo = Class(ui.Combo, [
            function $clazz() {
                this.Label    = Class(ui.Label, []);
                this.CompList = Class(ui.CompList, []);
            },

            function $prototype() {
                this.setMonths = function(months) {
                    for(var i = 0; i < months.length; i++) {
                        this.list.model.add(new this.clazz.Label(months[i].name));
                    }
                };

                this.padShown = function(b) {
                    if (b === true) {
                        this.list.position.setOffset(0);
                    }
                };
            },

            function() {
                this.$super(new this.clazz.CompList(true));
                this.button.removeMe();
            }
        ]);

        this.InfoPan = Class(ui.Panel, []);

        this.YearField = Class(ui.TextField, [
            function keyPressed(e) {
                switch (e.code) {
                    case ui.KeyEvent.UP  : if (this.fireNextYear != null) this.fireNextYear(); break;
                    case ui.KeyEvent.DOWN: if (this.firePrevYear != null) this.firePrevYear(); break;
                    default: return this.$super(e);
                }
            }
        ]);
    },

    function $prototype() {
        this.comboMonth = this.monthDaysGrid = null;
        this.selectedDate = this.minDate = this.maxDate = null;
        this.$freeze = false;

        this.canMonthBeShown = function(month, year) {
            return true;
        };

        this.showMonth = function(month, year) {
            pkg.validateDate(month, year);
            if (this.canMonthBeShown(month, year)) {
                this.monthDaysGrid.setValue(month, year);
            }
        };

        this.monthShown = function(src, prevMonth, prevYear) {
            if (this.selectedDate != null &&
                this.selectedDate.getMonth() == src.month &&
                this.selectedDate.getFullYear() == src.year)
            {
                src.selectCell(this.selectedDate, true);
            }

            this.comboMonth.select(src.month);
            this.yearText.setValue("" + src.year);
            this.repaint();
        };

        this.showNextYear = function() {
            this.showMonth(this.monthDaysGrid.month, this.monthDaysGrid.year + 1);
        };

        this.showPrevYear = function () {
            this.showMonth(this.monthDaysGrid.month, this.monthDaysGrid.year - 1);
        };

        this.showNextMonth = function () {
            if (this.monthDaysGrid.month < 0) {
                this.showMonth(0, 1900);
            }
            else {
                var d = new Date(this.monthDaysGrid.year,
                                  this.monthDaysGrid.month).nextMonth();
                this.showMonth(d.getMonth(), d.getFullYear());
            }
        };

        this.showPrevMonth = function () {
            if (this.showMonth < 0) {
                this.showMonth(0, 1900);
            }
            else {
                var d = new Date(this.monthDaysGrid.year, this.monthDaysGrid.month).prevMonth();
                this.showMonth(d.getMonth(), d.getFullYear());
            }
        };

        this.showSelectedMonth = function () {
            if (this.selectedDate != null) {
                this.showMonth(this.selectedDate.getMonth(),
                                this.selectedDate.getFullYear());
            }
        };

        this.canDateBeSet = function (date) {
            return  date == null || (
                        (this.minDate == null || pkg.compareDates(date, this.minDate) >= 0) &&
                        (this.maxDate == null || pkg.compareDates(date, this.maxDate) <= 0)
                    );
        };

        this.cellSelected = function(src, offset, b) {
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
    },

    function setMinValue(date) {
        if (arguments.length > 1) {
            date = new Date(arguments[2], arguments[1], arguments[0]);
        }

        if (date != null) pkg.validateDate(date);

        if (pkg.compareDates(this.minDate, date) !== 0) {
            if (pkg.compareDates(date, this.maxDate) === 1) {
                throw new RangeError();
            }

            this.minDate = date;
            if (pkg.compareDates(this.selectedDate, this.minDate) === -1) {
                this.setValue(null);
            }

            this.monthDaysGrid.retagModel();
        }
    },

    function setMaxValue(date) {
        if (arguments.length > 1) {
            date = new Date(arguments[2], arguments[1], arguments[0]);
        }

        if (date != null) pkg.validateDate(date);

        if (pkg.compareDates(this.maxDate, date) !== 0) {
            if (pkg.compareDates(date, this.minDate) === -1) {
                throw new RangeError("" + date + "," + this.minDate + "," + pkg.compareDates(date, this.minDate));
            }

            this.maxDate = date;
            if (pkg.compareDates(this.selectedDate, this.maxDate) === 1) {
                this.setValue(null);
            }

            this.monthDaysGrid.retagModel();
        }
    },

    function setValue(date) {
        if (arguments.length > 1) {
            date = new Date(arguments[2], arguments[1], arguments[0]);
        }

        if (this.$freeze !== true) {
            if (date != null) {
                pkg.validateDate(date);
            }

            if (this.canDateBeSet(date) === true && pkg.compareDates(this.selectedDate, date) !== 0) {
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
    },

    function(date) {
        if (date == null) date = new Date();

        var $this = this;

        this.$super(new zebkit.layout.BorderLayout());
        this.monthDaysGrid = new pkg.DaysGrid([
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
            layout: new zebkit.layout.BorderLayout(),
            kids  : {
                center: new ui.Panel({
                    layout : new zebkit.layout.FlowLayout("center", "center"),
                    kids   : [
                        this.comboMonth,
                        new ui.Panel({
                            layout : new zebkit.layout.BorderLayout(),
                            kids   : {
                                center : this.yearText,
                                right  : new ui.Panel({
                                    layout: new zebkit.layout.FlowLayout("center", "center", "vertical", 1),
                                    kids  : [
                                        new this.clazz.TopArrowButton(),
                                        new this.clazz.BottomArrowButton()
                                    ]
                                })
                            }
                        })
                    ]
                }),

                left: new ui.Panel({
                    layout : new zebkit.layout.FlowLayout("center", "center", "horizontal", 3),
                    kids   : [
                        new this.clazz.LeftArrowButton(),
                        new this.clazz.DotButton(),
                        new this.clazz.RightArrowButton()
                    ]
                }),

                right: new ui.Panel({
                    layout : new zebkit.layout.FlowLayout("center", "bottom"),
                    kids   : new this.clazz.Link("today"),
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
}
