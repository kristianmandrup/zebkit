/**
 * UI link component class.
 * @class zebkit.ui.Link
 * @param {String} s a link text
 * @constructor
 * @extends zebkit.ui.Button
 */
export default class Link extends Button {
    constructor(s) {
        super();

        this.cursorType = pkg.Cursor.HAND;

        // do it before super
        this.view = new pkg.DecoratedTextRender(s);
        this.overDecoration = "underline";
        this.$super(null);

        // if colors have not been set with default property set it here
        if (this.colors == null) {
            this.colors  = {
                "pressed.over" : "blue",
                "out"          : "white",
                "over"         : "white",
                "pressed.out"  : "black",
                "disabled"     : "gray"
            };
        }

        this.stateUpdated(this.state, this.state);        
    }

    /**
     * Set link font
     * @param {zebkit.ui.Font} f a font
     * @method setFont
     */
    setFont() {
        var old = this.view.font;
        this.view.setFont.apply(this, arguments);
        if (old != this.view.font) {
            this.vrp();
        }
        return this;
    }

    /**
     * Set the link text color for the specified link state
     * @param {String} state a link state
     * @param {String} c a link text color
     * @method  setColor
     */
    setColor(state,c){
        if (this.colors[state] != c){
            this.colors[state] = c;
            this.syncState();
        }
        return this;
    }

    setColors(colors) {
        this.colors = zebkit.clone(colors);
        this.syncState();
        return this;
    }

    setValue(s) {
        this.view.setValue(s.toString());
        this.repaint();
        return this;
    }

    // static

    stateUpdated(o,n){
        super.stateUpdated(o, n);

        var k = this.toViewId(n),
            b = false;

        if (this.view != null && this.view.color != this.colors[k] && this.colors[k] != null) {
            this.view.setColor(this.colors[k]);
            b = true;
        }

        if (this.overDecoration != null && this.isEnabled) {
            if (n === OVER) {
                this.view.setDecoration(this.overDecoration, this.colors[k]);
                b = true;
            } else if ( this.view.decorations[this.overDecoration] != null) {
                this.view.setDecoration(this.overDecoration, null);
                b = true;
            }
        }

        if (b) {
            this.repaint();
        }
    }
}
