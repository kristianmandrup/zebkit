import HtmlElement from './HtmlElement'; 

/**
 * @module  ui.html
 */
class HtmlFocusableElement extends HtmlElement {
    function $prototype() {
        this.$getElementRootFocus = function() {
            return this.element;
        };
    }
}
