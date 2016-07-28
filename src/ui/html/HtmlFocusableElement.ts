import HtmlElement from '../core/HtmlElement'; 

/**
 * @module  ui.html
 */
abstract class HtmlFocusableElement extends HtmlElement {
    constructor(e?) {
        super(e);
    }
    $getElementRootFocus() {
        return this.element;
    }
}

export default HtmlFocusableElement;