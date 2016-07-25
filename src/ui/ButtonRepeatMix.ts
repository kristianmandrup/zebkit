export default class ButtonRepeatMix extends Interface {
    function $prototype() {
        /**
         * Indicate if the button should
         * fire event by pressed event
         * @attribute isFireByPress
         * @type {Boolean}
         * @default false
         * @readOnly
         */
        this.isFireByPress = false;

        /**
         * Fire button event repeating period. -1 means
         * the button event repeating is disabled.
         * @attribute firePeriod
         * @type {Integer}
         * @default -1
         * @readOnly
         */
        this.firePeriod = -1;

        this.startIn = 400;

        /**
         * The method is executed for a button that is configured
         * to repeat fire events.
         * @method run
         * @protected
         */
        this.run = function() {
            if (this.state === PRESSED_OVER) this.fire();
        };

        /**
         * Set the mode the button has to fire events. Button can fire
         * event after it has been unpressed or immediately when it has
         * been pressed. Also button can start firing events periodically
         * when it has been pressed and held in the pressed state.
         * @param  {Boolean} b  true if the button has to fire event by
         * pressed event
         * @param  {Integer} firePeriod the period of time the button
         * has to repeat firing events if it has been pressed and
         * held in pressed state. -1 means event doesn't have
         * repeated
         * @param  {Integer} [startIn] the timeout when repeat events
         * has to be initiated
         * @method setFireParams
         */
        this.setFireParams = function (b, firePeriod, startIn){
            if (this.repeatTask != null) this.repeatTask.shutdown();
            this.isFireByPress = b;
            this.firePeriod = firePeriod;
            if (arguments.length > 2) this.startIn = startIn;
            return this;
        };

        this.fire = function() {
            this._.fired(this);
            if (this.catchFired != null) this.catchFired();
        };
    },

    function stateUpdated(o,n){
        this.$super(o, n);
        if (n === PRESSED_OVER) {
            if (this.isFireByPress === true){
                this.fire();
                if (this.firePeriod > 0) {
                    this.repeatTask = zebkit.util.task(this.run, this).run(this.startIn, this.firePeriod);
                }
            }
        }
        else {
            if (this.firePeriod > 0 && this.repeatTask != null) {
                this.repeatTask.shutdown();
            }

            if (n === OVER && (o === PRESSED_OVER && this.isFireByPress === false)) {
                this.fire();
            }
        }
    }
}