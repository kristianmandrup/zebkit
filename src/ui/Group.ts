

/**
 * Radio group switch manager implementation. This is an extension of "zebkit.ui.SwicthManager" to
 * support radio group switching behavior. You can use it event with normal checkbox:

       // create group of check boxes that will work as a radio group
       var gr = new zebkit.ui.Group();
       var ch1 = new zebkit.ui.Checkbox("Test 1", gr);
       var ch2 = new zebkit.ui.Checkbox("Test 2", gr);
       var ch3 = new zebkit.ui.Checkbox("Test 3", gr);

 * @class  zebkit.ui.Group
 * @constructor
 * @extends zebkit.ui.SwitchManager
 */

import SwitchManager from './SwitchManager';

export default class Group extends SwitchManager {
    constructor(un) {
        super();
        this.allowNoneSelected = false;

        this.getValue = function(o) {
            return o === this.selected;
        };

        this.setValue = function(o, b){
            if (this.allowNoneSelected && b === false && this.selected !== null) {
                var old = this.selected;
                this.selected = null;
                this.updated(old, false);
            } else if (b && this.selected !== o) {
                this.clearSelected();
                this.selected = o;
                this.updated(this.selected, true);
            }
            return this;
        }

        this.clearSelected = function() {
            if (this.selected !== null) {
                var old = this.selected;
                this.selected = null;
                this.updated(old, false);
            }
        }

        this.selected = null;
        if (arguments.length > 0) {
            this.allowNoneSelected = un;
        }
    }
}
