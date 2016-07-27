/**
 * The package contains number of classes to implement
 * UI date related component like calendar, date field etc.
 * @module ui.date
 * @main
 */

import { date } from '../date';

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
    return date.MONTHS[this.getMonth()].name;
};

Date.prototype.getMonthNick = function() {
    return date.MONTHS[this.getMonth()].nickname;
};

Date.prototype.getWeekdayName = function() {
    return date.WEEKS[this.getDay()].name;
};

Date.prototype.getWeekdayNick = function() {
    return date.WEEKS[this.getDay()].nickname;
};

Date.prototype.getMonth2 = function() {
    return this.getMonth() + 1;
};

