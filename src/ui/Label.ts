/**
 * Label UI component class. The label can be used to visualize simple string or multi lines text or
 * the given text render implementation:

        // render simple string
        var l = new zebkit.ui.Label("Simple string");

        // render multi lines text
        var l = new zebkit.ui.Label(new zebkit.data.Text("Multiline\ntext"));

        // render password text
        var l = new zebkit.ui.Label(new zebkit.ui.PasswordText("password"));

 * @param  {String|zebkit.data.TextModel|zebkit.ui.TextRender} [r] a text to be shown with the label.
 * You can pass a simple string or an instance of a text model or an instance of text render as the
 * text value.
 * @class zebkit.ui.Label
 * @constructor
 * @extends zebkit.ui.ViewPan
 */
import ViewPan from './ViewPan';

export default class Label extends ViewPan {
    constructor(r) {
        super();
        if (arguments.length === 0) {
            this.setView(new pkg.StringRender(""));
        } else {
            // test if input string is string
            if (typeof r === "string" || r.constructor === String) {
                this.setView(r.length === 0 || r.indexOf('\n') >= 0 ? new pkg.TextRender(new zebkit.data.Text(r))
                                                                    : new pkg.StringRender(r));
            } else if (typeof r.clazz !== "undefined" && r.clazz.isTextModel === true) {
                this.setView(new pkg.TextRender(r));
            } else {
                this.setView(r);
            }
        }        
    }
    /**
     * Get the label text
     * @return {String} a zebkit label text
     * @method getValue
     */
    this.getValue = function() {
        return this.view.getValue();
    };

    /**
     * Set the text field text model
     * @param  {zebkit.data.TextModel|String} m a text model to be set
     * @method setModel
     */
    this.setModel = function(m) {
        this.setView(zebkit.isString(m) ? new pkg.StringRender(m)
                                        : new pkg.TextRender(m));
    };

    this.getModel = function() {
        return this.view != null ? this.view.target : null;
    };

    /**
     * Get the label text color
     * @return {String} a zebkit label color
     * @method getColor
     */
    this.getColor = function (){
        return this.view.color;
    };

    /**
     * Get the label text font
     * @return {zebkit.ui.Font} a zebkit label font
     * @method getFont
     */
    this.getFont = function (){
        return this.view.font;
    };

    /**
     * Set the label text value
     * @param  {String} s a new label text
     * @method setValue
     * @chainable
     */
    this.setValue = function(s){
        if (s == null) s = "";

        var old = this.view.getValue();
        if (old !== s) {
            this.view.setValue(s);
            this.repaint();
        }

        return this;
    };

    /**
     * Set the label text color
     * @param  {String} c a text color
     * @method setColor
     * @chainable
     */
    this.setColor = function(c) {
        var old = this.view.color;
        if (old != c) {
            this.view.setColor(c);
            this.repaint();
        }
        return this;
    };

    /**
     * Set the label text font
     * @param  {zebkit.ui.Font} f a text font
     * @method setFont
     * @chainable
     */
    this.setFont = function(f) {
        var old = this.view.font;
        this.view.setFont.apply(this.view, arguments);
        if (old != this.view.font) {
            this.repaint();
        }
        return this;
    }
}