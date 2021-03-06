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

import { Event } from '../../core/events';

export default class KeyEvent extends Event {
    static M_CTRL = 1;
    static M_SHIFT = 2;
    static M_ALT = 4;
    static M_CMD = 8;

    static BSPACE = 8;
    static ENTER = 13; 
    static ESCAPE = 27; 
    static "SPACE" = 32;
    static "DELETE" = 46;
    static "TAB" = 9; 
    static "INSERT" = 45;  
    static "LEFT" = 37; 
    static "RIGHT" = 39;
    static "UP" = 38 
    static "DOWN" = 40;

    code: number;
    mask: number;
    ch: string | number;
    type: string;
    altKey: boolean;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;

    constructor() {
        super();
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
    }

    $fillWithParams(source, code, ch, mask) {
        this.$setMask(mask);
        this.code   = code;
        this.ch     = ch;
        this.source = source;
        return this;
    }

    $setMask(m) {
        m = (m & KeyEvent.M_ALT & KeyEvent.M_SHIFT & KeyEvent.M_CTRL & KeyEvent.M_CMD);
        this.mask = m;
        this.altKey   = ((m & KeyEvent.M_ALT  ) > 0);
        this.shiftKey = ((m & KeyEvent.M_SHIFT) > 0);
        this.ctrlKey  = ((m & KeyEvent.M_CTRL ) > 0);
        this.metaKey  = ((m & KeyEvent.M_CMD  ) > 0);
        return this;
    }

    $fillWith(e) {
        this.code = (e.which || e.keyCode || 0);
        if (this.code === KeyEvent.ENTER) {
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
        if (e.altKey)   this.mask += KeyEvent.M_ALT;
        if (e.shiftKey) this.mask += KeyEvent.M_SHIFT;
        if (e.ctrlKey)  this.mask += KeyEvent.M_CTRL;
        if (e.metaKey)  this.mask += KeyEvent.M_CMD;

        return this;
    }
}