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
class HtmlTextInput extends HtmlFocusableElement {
    function $prototype() {
        this.cursorType = pkg.Cursor.TEXT;

        /**
         * Get a text of the text input element
         * @return {String} a text of the  text input element
         * @method getValue
         */
        this.getValue = function() {
            return this.element.value.toString();
        };

        /**
         * Set the text
         * @param {String} t a text
         * @method setValue
         */
        this.setValue = function(t) {
            if (this.element.value !== t) {
                this.element.value = t;
                this.vrp();
            }
        };
    },

    function(text, e) {
        if (text == null) text = "";
        this.$super(e);
        this.setAttribute("tabindex", 0);
        this.setValue(text);
    }
}