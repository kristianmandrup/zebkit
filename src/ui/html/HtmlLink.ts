import HtmlElement from './HtmlElement';

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
        this._ = new zebkit.util.Listeners();
        var $this = this;
        this.element.onclick = function(e) {
            $this._.fired($this);
        };
    }
}
