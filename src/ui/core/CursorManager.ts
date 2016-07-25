
/**
 * Cursor manager class. Allows developers to control pointer cursor type by implementing an own
 * getCursorType method or by specifying a cursor by cursorType field. Imagine an UI component
 * needs to change cursor type. It
 *  can be done by one of the following way:

    - **Implement getCursorType method by the component itself if the cursor type depends on cursor location**

          var p = new zebkit.ui.Panel([
               // implement getCursorType method to set required
               // pointer cursor type
               function getCursorType(target, x, y) {
                   return zebkit.ui.Cursor.WAIT;
               }
          ]);

    - **Define "cursorType" property in component if the cursor type doesn't depend on cursor location **

          var myPanel = new zebkit.ui.Panel();
          ...
          myPanel.cursorType = zebkit.ui.Cursor.WAIT;

 *  @class zebkit.ui.CursorManager
 *  @constructor
 *  @extends {zebkit.ui.Manager}
 */
export default class CursorManager extends Manager {
    cursorType: string;
    source: any;
    target: any;
    $isFunc: boolean;

    constructor() {
        super();
        /**
         * Current cursor type
         * @attribute cursorType
         * @type {String}
         * @readOnly
         * @default "default"
         */
        this.cursorType = "default";
        this.source = this.target = null;
        this.$isFunc = false;        
    }
    /**
     * Define pointer moved events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerMoved
     */
    pointerMoved(e){
        if (this.$isFunc === true) {
            this.cursorType = this.source.getCursorType(this.source, e.x, e.y);
            this.target.style.cursor = (this.cursorType == null) ? "default"
                                                                  : this.cursorType;
        }
    }

    /**
     * Define pointer entered events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerEntered
     */
    pointerEntered(e){
        if (e.source.cursorType != null || e.source.getCursorType != null) {
            this.$isFunc = (e.source.getCursorType != null);
            this.target = e.target;
            this.source = e.source;

            this.cursorType = this.$isFunc === true ? this.source.getCursorType(this.source, e.x, e.y)
                                                    : this.source.cursorType;

            this.target.style.cursor = (this.cursorType == null) ? "default"
                                                                  : this.cursorType;
        }
    }

    /**
     * Define pointer exited events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerExited
     */
    pointerExited(e){
        if (this.source != null) {
            this.cursorType = "default";
            if (this.target.style.cursor != this.cursorType) {
                this.target.style.cursor = this.cursorType;
            }
            this.source = this.target = null;
            this.$isFunc = false;
        }
    }

    /**
     * Define pointer dragged events handler.
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragged
     */
    pointerDragged(e) {
        if (this.$isFunc === true) {
            this.cursorType = this.source.getCursorType(this.source, e.x, e.y);
            this.target.style.cursor = (this.cursorType == null) ? "default"
                                                                  : this.cursorType;
        }
    }
}