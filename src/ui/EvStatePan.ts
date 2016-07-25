
/**
 * Event state panel class. The class implements UI component whose face, border and
 * background view depends on its input events state. The component is good basis
 * for creation  dynamic view UI components.The state the component can be is:

    - **over** the pointer cursor is inside the component
    - **out** the pointer cursor is outside the component
    - **pressed over** the pointer cursor is inside the component and an action pointer
      button or key is pressed
    - **pressed out** the pointer cursor is outside the component and an action pointer
      button or key is pressed
    - **disabled** the component is disabled

 * The view border, background or face should be set as "zebkit.ui.ViewSet" where an required
 * for the given component state view is identified by an id. By default corresponding to
 * component states views IDs are the following: "over", "pressed.over", "out", "pressed.out",
 * "disabled".  Imagine for example we have two colors and we need to change between the colors
 * every time pointer cursor is over/out of the component:

     // create state panel
     var statePan = new zebkit.ui.EvStatePan();

     // add dynamically updated background
     statePan.setBackground(new zebkit.ui.ViewSet({
        "over": "red",
        "out": "blue"
     }));

 * Alone with background border view can be done also dynamic

     // add dynamically updated border
     statePan.setBorder(new zebkit.ui.ViewSet({
        "over": new zebkit.ui.Border("green", 4, 8),
        "out": null
     }));

 * Additionally the UI component allows developer to specify whether the component can hold
 * input focus and which UI component has to be considered as the focus marker. The focus marker
 * component is used as anchor to paint focus marker view. In simple case the view can be just
 * a border. So border will be rendered around the focus marker component:

     // create state panel that contains one label component
     var statePan = new zebkit.ui.EvStatePan();
     var lab      = new zebkit.ui.Label("Focus marker label");
     lab.setPadding(6);
     statePan.setPadding(6);
     statePan.setLayout(new zebkit.layout.BorderLayout());
     statePan.add("center", lab);

     // set label as an anchor for focus border indicator
     statePan.setFocusAnchorComponent(lab);
     statePan.setFocusMarkerView("plain");

 * @class zebkit.ui.EvStatePan
 * @constructor
 * @extends zebkit.ui.StatePan
 */
var OVER = "over", PRESSED_OVER = "pressed.over", OUT = "out", PRESSED_OUT = "pressed.out", DISABLED = "disabled";

export default class EvStatePan extends StatePan {
    constructor() {
        super();
        this.state = OUT;
        this.$isIn = false;
    }

    toViewId(state) {
        return state;
    }

    _keyPressed(e) {
        if (this.state !== PRESSED_OVER &&
            this.state !== PRESSED_OUT  &&
            (e.code === pkg.KeyEvent.ENTER || e.code === pkg.KeyEvent.SPACE))
        {
            this.setState(PRESSED_OVER);
        }
    }

    _keyReleased(e) {
        if (this.state === PRESSED_OVER || this.state === PRESSED_OUT){
            var prev = this.state;
            this.setState(OVER);
            if (this.$isIn === false) this.setState(OUT);
        }
    }

    _pointerEntered(e) {
        if (this.isEnabled === true) {
            this.setState(this.state === PRESSED_OUT ? PRESSED_OVER : OVER);
            this.$isIn = true;
        }
    }

    _pointerPressed(e) {
        if (this.state !== PRESSED_OVER && this.state !== PRESSED_OUT && e.isAction()){
            this.setState(PRESSED_OVER);
        }
    }

    _pointerReleased(e) {
        if ((this.state === PRESSED_OVER || this.state === PRESSED_OUT) && e.isAction()){
            if (e.source === this) {
                this.setState(e.x >= 0 && e.y >= 0 && e.x < this.width && e.y < this.height ? OVER
                                                                                            : OUT);
            }
            else {
                var p = zebkit.layout.toParentOrigin(e.x, e.y, e.source, this);
                this.$isIn = p.x >= 0 && p.y >= 0 && p.x < this.width && p.y < this.height;
                this.setState(this.$isIn ? OVER : OUT);
            }
        }
    }

    childKeyPressed(e) {
        this._keyPressed(e);
    }

    childKeyReleased(e) {
        this._keyReleased(e);
    }

    childPointerEntered(e) {
        this._pointerEntered(e);
    }

    childPointerPressed(e) {
        this._pointerPressed(e);
    }

    childPointerReleased(e) {
        this._pointerReleased(e);
    }

    childPointerExited(e) {
        // check if the pointer cursor is in of the source component
        // that means another layer has grabbed control
        if (e.x >= 0 && e.y >= 0 && e.x < e.source.width && e.y < e.source.height) {
            this.$isIn = false;
        }
        else {
            var p = zebkit.layout.toParentOrigin(e.x, e.y, e.source, this);
            this.$isIn = p.x >= 0 && p.y >= 0 && p.x < this.width && p.y < this.height;
        }

        if (this.$isIn === false) {
            this.setState(this.state === PRESSED_OVER ? PRESSED_OUT : OUT);
        }
    }

    /**
     * Define key pressed events handler
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyPressed
     */
    keyPressed(e){
        this._keyPressed(e);
    }

    /**
     * Define key released events handler
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyReleased
     */
    keyReleased(e){
        this._keyReleased(e);
    }

    /**
     * Define pointer entered events handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerEntered
     */
    pointerEntered(e){
        this._pointerEntered();
    }

    /**
     * Define pointer exited events handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerExited
     */
    pointerExited(e){
        if (this.isEnabled === true) {
            this.setState(this.state === PRESSED_OVER ? PRESSED_OUT : OUT);
            this.$isIn = false;
        }
    }

    /**
     * Define pointer pressed events handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerPressed
     */
    pointerPressed(e){
        this._pointerPressed(e);
    }

    /**
     * Define pointer released events handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerReleased
     */
    pointerReleased(e){
        this._pointerReleased(e);
    }

    /**
     * Define pointer dragged events handler
     * @param  {zebkit.ui.PointerEvent} e a key event
     * @method pointerDragged
     */
    pointerDragged(e){
        if (e.isAction()) {
            var pressed = (this.state === PRESSED_OUT || this.state === PRESSED_OVER);
            if (e.x > 0 && e.y > 0 && e.x < this.width && e.y < this.height) {
                this.setState(pressed ? PRESSED_OVER : OVER);
            }
            else {
                this.setState(pressed ? PRESSED_OUT : OUT);
            }
        }
    }

    setEnabled(b) {
        super.setEnabled(b);
        this.setState(b ? OUT : DISABLED);
        return this;
    }
}
