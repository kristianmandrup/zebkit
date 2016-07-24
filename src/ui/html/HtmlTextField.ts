import HtmlTextField from './HtmlTextField';

/**
 * HTML input text element wrapper class. The class wraps standard HTML text field
 * and represents it as zebkit UI component.
 * @constructor
 * @class zebkit.ui.HtmlTextField
 * @param {String} [text] a text the text field component has to be filled with
 * @extends zebkit.ui.HtmlTextInput
 */
class HtmlTextField extends HtmlTextInput {
    function(text) {
        this.$super(text, "input");
        this.element.setAttribute("type",  "text");
    }
}
