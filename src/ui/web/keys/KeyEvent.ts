/**
 * Input key event class.
 * @param {zebkit.ui.Panel} source a source of the key input event
 * @param {Integer} code a code of pressed key
 * @param {String} ch a character of typed key
 * @param {Integer} mask a bits mask of pressed meta keys:  zebkit.ui.KeyEvent.M_CTRL,
 * zebkit.ui.KeyEvent.M_SHIFT, zebkit.ui.KeyEvent.M_ALT, zebkit.ui.KeyEvent.M_CMD
 * @class  zebkit.ui.KeyEvent
 * @extends zebkit.util.Event
 * @constructor
 */
export default class KeyEvent extends util.Event {
    function $clazz() {
        this.M_CTRL  = 1;
        this.M_SHIFT = 2;
        this.M_ALT   = 4;
        this.M_CMD   = 8;
    },

    function $prototype() {
        /**
         * A code of a pressed key
         * @attribute code
         * @readOnly
         * @type {Integer}
         */
        this.code = 0;

        /**
         * A bits mask of pressed meta keys (CTRL, ALT, etc)
         * @attribute mask
         * @readOnly
         * @type {Integer}
         */
        this.mask = 0;

        /**
         * A character of a typed key
         * @attribute ch
         * @readOnly
         * @type {String}
         */
        this.ch = 0;

        this.type = "kb";

        this.altKey = this.shiftKey = this.ctrlKey = this.metaKey = false;


        this.$fillWithParams = function(source, code, ch, mask) {
            this.$setMask(mask);
            this.code   = code;
            this.ch     = ch;
            this.source = source;
            return this;
        };

        this.$setMask = function(m) {
            m = (m & pkg.KeyEvent.M_ALT & pkg.KeyEvent.M_SHIFT & pkg.KeyEvent.M_CTRL & pkg.KeyEvent.M_CMD);
            this.mask = m;
            this.altKey   = ((m & pkg.KeyEvent.M_ALT  ) > 0);
            this.shiftKey = ((m & pkg.KeyEvent.M_SHIFT) > 0);
            this.ctrlKey  = ((m & pkg.KeyEvent.M_CTRL ) > 0);
            this.metaKey  = ((m & pkg.KeyEvent.M_CMD  ) > 0);
            return this;
        };

        this.$fillWith = function(e) {
            this.code = (e.which || e.keyCode || 0);
            if (this.code === pkg.KeyEvent.ENTER) {
                this.ch = "\n";
            }
            else {
                // FF sets keyCode to zero for some diacritic characters
                // to fix the problem we have to try get the code from "key" field
                // of event that stores a character
                if (this.code === 0 && e.key != null && e.key.length() === 1) {
                    this.code = e.key.charCodeAt(0);
                    this.ch   = e.key;
                } else {
                    this.ch = e.charCode > 0 && this.code >= 32 ? String.fromCharCode(e.charCode) : 0;
                }
            }

            this.altKey   = e.altKey;
            this.shiftKey = e.shiftKey;
            this.ctrlKey  = e.ctrlKey;
            this.metaKey  = e.metaKey;

            this.mask = 0;
            if (e.altKey)   this.mask += pkg.KeyEvent.M_ALT;
            if (e.shiftKey) this.mask += pkg.KeyEvent.M_SHIFT;
            if (e.ctrlKey)  this.mask += pkg.KeyEvent.M_CTRL;
            if (e.metaKey)  this.mask += pkg.KeyEvent.M_CMD;

            return this;
        };
    },
}