import HtmlTextInput from './HtmlTextInput';

/**
 * HTML input text element wrapper class. The class wraps standard HTML text field
 * and represents it as zebkit UI component.
 * @constructor
 * @class zebkit.ui.HtmlTextField
 * @param {String} [text] a text the text field component has to be filled with
 * @extends zebkit.ui.HtmlTextInput
 */
export default class HtmlTextField extends HtmlTextInput {
    constructor(text) {
        super(text, "input");
        this.element.setAttribute("type",  "text");
    }
}
