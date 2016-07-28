import HtmlElement from 'dom'; 

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