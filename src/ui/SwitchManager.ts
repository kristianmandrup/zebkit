
/**
 * The standard UI checkbox component switch manager implementation. The manager holds
 * boolean state of a checkbox UI component. There are few ways how a checkbox can
 * switch its state: standard checkbox or radio group. In general we have a deal with
 * one switchable UI component that can work in different modes. Thus we can re-use
 * one UI, but customize it with appropriate switch manager. That is the main idea of
 * having the class.
 * @constructor
 * @class  zebkit.ui.SwitchManager
 */

/**
 * Fired when a state has been updated

        var ch = new zebkit.ui.Checkbox("Test");
        ch.manager.bind(function (src, ui) {
            ...
        });

 * @event stateUpdated
 * @param {zebkit.ui.SwitchManager} src a switch manager that controls and tracks the event
 * @param {zebkit.ui.Checkbox} ui  an UI component that triggers the event
 */
export default class SwitchManager {
    constructor() {
        this.value = false;

        /**
         * Get current state of the given UI component
         * @param  {zebkit.ui.Checkbox} o an ui component
         * @return {Boolean}  a boolean state
         * @method getValue
         */
        this.getValue = function(o) {
            return this.value;
        };

        /**
         * Set the state for the given UI component
         * @param  {zebkit.ui.Checkbox} o an ui component
         * @param  {Boolean} b  a boolean state
         * @method setValue
         */
        this.setValue = function(o, b) {
            if (this.getValue(o) != b){
                this.value = b;
                this.updated(o, b);
            }
            return this;
        };

        this.toggle = function(o) {
            this.setValue(o, !this.getValue(o));
            return this;
        };

        /**
         * Called every time a state has been updated.
         * @param  {zebkit.ui.Checkbox} o an ui component for which the state has been updated
         * @param  {Boolean} b  a new boolean state of the UI component
         * @method stateUpdated
         */
        this.updated = function(o, b){
            if (o != null) o.switched(b);
            this._.fired(this, o);
        };

        /**
         * Call when the manager has been installed for the given UI component
         * @protected
         * @param  {zebkit.ui.Checkbox} o an UI component the switch manager is designated
         * @method install
         */
        this.install = function(o) {
            o.switched(this.getValue(o));
        };

        /**
         * Call when the manager has been uninstalled for the given UI component
         * @protected
         * @param  {zebkit.ui.Checkbox} o an UI component the switch manager is not anymore used
         * @method uninstall
         */
        this.uninstall = function(o) {};

        this[''] = function() {
            this._ = new zebkit.util.Listeners();
        };
    }
}