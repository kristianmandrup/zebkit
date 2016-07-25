/**
 * Radio-box UI component class. This class is extension of "zebkit.ui.Checkbox" class that sets group
 * as a default switch manager. The other functionality id identical to checkbox component. Generally
 * speaking this class is a shortcut for radio box creation.
 * @class  zebkit.ui.Radiobox
 * @constructor
 * @param {String|zebkit.ui.Panel} [label] a label
 * @param {zebkit.ui.Group} [m] a switch manager
 */
import Group from './Group';

export default class Radiobox extends Checkbox {
    constructor(c, group) {
        super(c, group == null ? new Group() : group);
    }
}