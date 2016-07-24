import TextField from './TextField';

/**
 * Text area UI component. The UI component to render multi-lines text.
 * @class zebkit.ui.TextArea
 * @constructor
 * @param {String} [txt] a text
 * @extends zebkit.ui.TextField
 */
class TextArea extends TextField {
    function(txt) {
        if (arguments.length === 0) txt = "";
        this.$super(new zebkit.data.Text(txt));
    }
}
