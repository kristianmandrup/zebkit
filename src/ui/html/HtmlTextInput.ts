import HtmlFocusableElement from './HtmlFocusableElement';

/**
 * HTML input element wrapper class. The class can be used as basis class
 * to wrap HTML elements that can be used to enter a textual information.
 * @constructor
 * @param {String} text a text the text input component has to be filled with
 * @param {String} element an input element name
 * @class zebkit.ui.HtmlTextInput
 * @extends zebkit.ui.HtmlElement
 */
export default class HtmlTextInput extends HtmlFocusableElement {
    cursorType: any;
    element: any; // DOM

    constructor(text, e) {
        super(e);

        if (text == null) text = "";
        
        this.setAttribute("tabindex", 0);
        this.setValue(text);

        this.cursorType = pkg.Cursor.TEXT;
    }
    /**
     * Get a text of the text input element
     * @return {String} a text of the  text input element
     * @method getValue
     */
    getValue() {
        return this.element.value.toString();
    }

    /**
     * Set the text
     * @param {String} t a text
     * @method setValue
     */
    setValue(t) {
        if (this.element.value !== t) {
            this.element.value = t;
            this.vrp();
        }
    }
}