abstract class Switchable {
    manager: any;

    constructor() {
        this.manager = null;
    }

    /**
     * Set the check box state
     * @param  {Boolean} b a state
     * @chainable
     * @method setValue
     */
    setValue(b) {
        this.manager.setValue(this, b);
        return this;
    }

    toggle() {
        this.manager.toggle(this);
        return this;
    }

    /**
     * Get the check box state
     * @return {Boolean} a check box state
     * @method getValue
     */
    getValue() {
        return this.manager ? this.manager.getValue(this) : false;
    };

    /**
     * Set the specified switch manager
     * @param {zebkit.ui.SwicthManager} m a switch manager
     * @method setSwicthManager
     */
    setSwitchManager(m){
        /**
         * A switch manager
         * @attribute manager
         * @readOnly
         * @type {zebkit.ui.SwitchManager}
         */
        if (m == null) {
            throw new Error("Null switch manager");
        }

        if (this.manager !== m) {
            if (this.manager !== null) this.manager.uninstall(this);
            this.manager = m;
            this.manager.install(this);
        }

        return this;
    }
}

export default Switchable;