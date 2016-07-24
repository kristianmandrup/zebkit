export function validateDate(day, month, year) {
    var d = (arguments.length < 3) ? (arguments.length === 1 ? day : new Date(month, day))
                                    : new Date(year, month, day);
    if (d.isValid() == false) {
        throw new Error("Invalid date : " + d);
    }
};

export function compareDates(d1, d2) {
    if (arguments.length === 2 && d1 === d2) {
        return 0;
    }

    // exclude null dates
    if (d1 == null || d2 == null) {
        return null;
    }

    var day1, month1, year1,
        day2, month2, year2,
        i = 1;

    if (d1 instanceof Date) {
        day1   = d1.getDate();
        month1 = d1.getMonth();
        year1  = d1.getFullYear();
    }
    else {
        day1   = arguments[0];
        month1 = arguments[1];
        year1  = arguments[2];
        i = 3;
    }

    d2 = arguments[i];
    if (d2 instanceof Date) {
        day2   = d2.getDate();
        month2 = d2.getMonth();
        year2  = d2.getFullYear();
    }
    else {
        day2   = arguments[i];
        month2 = arguments[i + 1];
        year2  = arguments[i + 2];
    }

    if (day1 === day2 && month1 === month2 && year1 === year2) {
        return 0;
    }

    if (year1 > year2 ||
        (year1 === year2 && month1 > month2) ||
        (year1 === year2 && month1 === month2 && day1 > day2))
    {
        return 1;
    }
    return -1;
};

/**
 * The package contains number of classes to implement
 * UI date related component like calendar, date field etc.
 * @module ui.date
 * @main
 */

Date.prototype.daysInMonth = function() {
    return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
};

Date.prototype.firstWeekDay = function() {
    return new Date(this.getFullYear(), this.getMonth(), 1).getDay();
};

Date.prototype.prevMonth = function() {
    return new Date(this.getFullYear(), this.getMonth() - 1, 1);
};

Date.prototype.nextMonth = function() {
    return new Date(this.getFullYear(), this.getMonth() + 1, 1);
};

Date.prototype.isValid = function() {
    // invalid dates have time set
    // to NaN, NaN never equals each other
    return this.getTime() === this.getTime();
};

Date.prototype.getMonthName = function() {
    return pkg.MONTHS[this.getMonth()].name;
};

Date.prototype.getMonthNick = function() {
    return pkg.MONTHS[this.getMonth()].nickname;
};

Date.prototype.getWeekdayName = function() {
    return pkg.WEEKS[this.getDay()].name;
};

Date.prototype.getWeekdayNick = function() {
    return pkg.WEEKS[this.getDay()].nickname;
};

Date.prototype.getMonth2 = function() {
    return this.getMonth() + 1;
};

