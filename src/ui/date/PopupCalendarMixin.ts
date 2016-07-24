    var PopupCalendarMix = zebkit.Interface([
        function childKeyPressed(e) {
            if (e.code === ui.KeyEvent.ENTER) this.showCalendar(e.source);
            else {
                if (e.code === ui.KeyEvent.BSPACE);
            }
        },

        function getCalendar() {
            if (this.calendar == null) {
                var $this = this;

                this.$freezeCalendar = false;

                this.calendar = new pkg.Calendar([
                    function winActivated (e){
                        if (e.isActive === false) {
                            $this.hideCalendar();
                        }
                    },

                    function childKeyPressed(e){
                        if (e.code === ui.KeyEvent.ESCAPE) {
                            $this.hideCalendar();
                        }
                    }
                ]);

                this.calendar.bind(function dateSet() {
                    if ($this.$freezeCalendar === false) {
                        if ($this.calendarDateSet != null) {
                            $this.calendarDateSet.apply($this, arguments);
                        }
                        $this.hideCalendar();
                    }
                });
            }
            return this.calendar;
        },

        function showCalendar(anchor) {
            try {
                this.$freezeCalendar = true;

                var calendar = this.getCalendar();
                this.hideCalendar();
                this.anchor = anchor;

                var c = this.getCanvas(),
                    w = c.getLayer("win"),
                    p = zebkit.layout.toParentOrigin(0, 0, anchor, c);

                calendar.toPreferredSize();

                p.y = p.y + anchor.height;
                if (p.y + calendar.height > w.height - w.getBottom()) {
                    p.y = p.y - calendar.height - anchor.height - 1;
                }

                if (p.x + calendar.width > w.width - w.getRight()) {
                    p.x -= (p.x + calendar.width - w.width + w.getRight());
                }

                calendar.setLocation(p.x, p.y);
                ui.showWindow(this, "mdi", calendar);

                ui.activateWindow(calendar);
                calendar.monthDaysGrid.requestFocus();

                if (this.calendarShown != null) {
                    this.calendarShown(this.calendar);
                }
            }
            finally {
                this.$freezeCalendar = false;
            }
        },

        function  hideCalendar() {
            var calendar = this.getCalendar();
            if (calendar.parent != null) {
                calendar.removeMe();
                if (this.calendarHidden != null) this.calendarHidden();
                this.anchor.requestFocus();
                this.anchor = null;
            }
        }
    ]);