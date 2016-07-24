/**
 * HTML input textarea element wrapper class. The class wraps standard HTML textarea
 * element and represents it as zebkit UI component.
 * @constructor
 * @param {String} [text] a text the text area component has to be filled with
 * @class zebkit.ui.HtmlTextArea
 * @extends zebkit.ui.HtmlTextInput
 */
class HtmlTextArea extends HtmlTextInput {
    function setResizeable(b) {
        this.setStyle("resize", b === false ? "none" : "both");
    },

    function(text) {
        this.$super(text, "textarea");
        this.element.setAttribute("rows", 10);
    }
}