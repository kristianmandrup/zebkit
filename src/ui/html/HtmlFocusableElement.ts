import HtmlElement from 'dom'; 

/**
 * @module  ui.html
 */
export default class HtmlFocusableElement extends HtmlElement {
    constructor(e?) {
        super(e);
    }
    $getElementRootFocus() {
        return this.element;
    }
}
