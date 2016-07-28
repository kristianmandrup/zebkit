import TextField from '../../field/TextField';
import * as dates from '../utils'; 
import { format } from '../../../utils/format';

export default class DateTextField extends TextField {
    maxWidth: number;
    notDefined: string;
    date: any; // Date

    constructor(public format : string) {
        super();
        if (format == null) {
            format = "${2,0,date}/${2,0,month2}/${4,0,fullYear}";
        }
    
        this.setFormat(format);
        this.maxWidth = 0;

        this.notDefined = "-";
        this.date = null;
    }

    protected $format(d) {
        return format(this.format, d != null ? d :{}, this.notDefined);
    }

    setFormat(format) {
        if (this.format != format) {
            this.format = format;
            this.$getSuper("setValue").call(this, this.$format(this.date));
        }
    }

    setValue(d) {
        if (d != null) dates.validateDate(d);

        if (dates.compareDates(this.date, d) !== 0) {
            this.date = d;
            super.setValue(this.$format(this.date));
        }
    }

    calcPreferredSize(target) {
        var ps = super.calcPreferredSize(target);
        ps.width = this.maxWidth;
        return ps;
    }

    focused() : void {
        if (this.hasFocus()) {
            this.selectAll();
        }
        else {
            this.clearSelection();
        }
        super.focused();
    }

    recalc() : void {
        super.recalc();
        var s = this.$format(new Date());
        this.maxWidth = this.getFont().stringWidth(s);
        this.maxWidth += Math.floor(this.maxWidth / 10);
    }
}