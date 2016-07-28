import HtmlElement from '../core/HtmlElement';
import { Listeners } from '../../utils/listen';

/**
 * [description]
 * @param  {[type]} text  [description]
 * @param  {zebkit}  href)
 * @return {[type]}       [description]
 */
export default class HtmlLink extends HtmlElement {
    constructor(text, href) {
        super("a");
        this.setContent(text);
        this.setAttribute("href", href == null ? "#": href);
        this._ = new Listeners();
        this.element.onclick = (e) => {
            this._.fired(this);
        };
    }
}
