/**
 * Mouse and touch screen input event class. The input event is
 * triggered by a mouse or touch screen.
 * @param {zebkit.ui.Panel} source a source of the mouse input event
 * @param {Integer} ax an absolute (relatively to a canvas where the source
 * UI component is hosted) mouse pointer x coordinate
 * @param {Integer} ax an absolute (relatively to a canvas where the source
 * UI component is hosted) mouse pointer y coordinate
 * @param {Integer} mask a bits mask of pressed mouse buttons:

         zebkit.ui.PointerEvent.LEFT_BUTTON
         zebkit.ui.PointerEvent.RIGHT_BUTTON

 * @class  zebkit.ui.PointerEvent
 * @constructor
 */
export default class PointerEvent extends util.Event {
    function $prototype() {
        /**
         * Pointer type. Can be "mouse", "touch", "pen"
         * @attribute  poiterType
         * @type {String}
         */
        this.pointerType = "mouse";

        /**
         * Touch counter
         * @attribute touchCounter
         * @type {Integer}
         * @default 0
         */
        this.touchCounter = 0;

        /**
         * Page x
         * @attribute pageX
         * @type {Integer}
         * @default -1
         */
        this.pageX = -1;

        /**
         * Page y
         * @attribute pageY
         * @type {Integer}
         * @default -1
         */
        this.pageY = -1;

        /**
         * Target DOM element
         * @attribute target
         * @type {DOMElement}
         * @default null
         */
        this.target = null;

        /**
         * Pointer identifier
         * @attribute identifier
         * @type {Object}
         * @default null
         */
        this.identifier = null;

        this.shiftKey = this.altKey = this.metaKey = this.ctrlKey = false;

        this.pressure = 0.5;

        this.isAction = function() {
            return this.identifier !== RMOUSE && this.touchCounter === 1;
        };

        this.$fillWith = function(identifier, e) {
            this.pageX      = Math.floor(e.pageX);
            this.pageY      = Math.floor(e.pageY);
            this.target     = e.target;
            this.identifier = identifier;
            this.altKey     = typeof e.altKey   !== 'undefined' ? e.altKey   : false;
            this.shiftKey   = typeof e.shiftKey !== 'undefined' ? e.shiftKey : false;
            this.ctrlKey    = typeof e.ctrlKey  !== 'undefined' ? e.ctrlKey  : false;
            this.metaKey    = typeof e.metaKey  !== 'undefined' ? e.metaKey  : false;
            this.pressure   = typeof e.pressure !== 'undefined' ? e.pressure : 0.5;
        };

        this.getTouches = function() {
            var touches = [], i = 0;
            for(var k in pkg.$pointerPressedEvents) {
                var pe = pkg.$pointerPressedEvents[k];
                touches[i++] = {
                    pageX      : pe.pageX,
                    pageY      : pe.pageY,
                    identifier : pe.identifier,
                    target     : pe.target,
                    pressure   : pe.pressure,
                    pointerType: pe.stub.pointerType
                }
            }
            return touches;
        };
    }
}
