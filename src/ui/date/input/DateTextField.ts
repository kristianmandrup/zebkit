class DateTextField extends ui.TextField {
    function $prototype() {
        this.notDefined = "-";
        this.date = null;

        this.$format = function(d) {
            return zebkit.util.format(this.format, d != null ? d :{}, this.notDefined);
        };
    },

    function setFormat(format) {
        if (this.format != format) {
            this.format = format;
            this.$getSuper("setValue").call(this, this.$format(this.date));
        }
    },

    function setValue(d) {
        if (d != null) pkg.validateDate(d);

        if (pkg.compareDates(this.date, d) !== 0) {
            this.date = d;
            this.$super(this.$format(this.date));
        }
    },

    function calcPreferredSize(target) {
        var ps = this.$super(target);
        ps.width = this.maxWidth;
        return ps;
    },

    function focused () {
        if (this.hasFocus()) {
            this.selectAll();
        }
        else {
            this.clearSelection();
        }
        this.$super();
    },

    function recalc() {
        this.$super();
        var s = this.$format(new Date());
        this.maxWidth = this.getFont().stringWidth(s);
        this.maxWidth += Math.floor(this.maxWidth / 10);
    },

    function(format) {
        if (format == null) {
            format = "${2,0,date}/${2,0,month2}/${4,0,fullYear}";
        }

        this.$super();
        this.setFormat(format);
        this.maxWidth = 0;
    }
}