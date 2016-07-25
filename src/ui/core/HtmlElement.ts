import Panel from './Panel';

const $store = [
    "paddingTop","paddingLeft","paddingBottom","paddingRight",
    "border","borderStyle","borderWidth", "borderTopStyle",
    "borderTopWidth", "borderBottomStyle","borderBottomWidth",
    "borderLeftStyle","borderLeftWidth", "borderRightStyle",
    "visibility", "borderRightWidth", "width", "height", "position"
];


/**
 * HTML element UI component wrapper class. The class represents
 * an HTML element as if it is standard UI component. It helps to use
 * some standard HTML element as zebkit UI components and embeds it
 * in zebkit UI application layout.
 * @class zebkit.ui.HtmlElement
 * @constructor
 * @param {String|HTMLElement} [element] an HTML element to be represented
 * as a standard zebkit UI component. If the passed parameter is string
 * it denotes a name of an HTML element. In this case a new HTML element
 * will be created.
 * @extends {zebkit.ui.Panel}
 */
export default class HtmlElement extends Panel {
    $clazz = {
        CLASS_NAME: null,
        $bodyFontSize: window.getComputedStyle(document.body, null).getPropertyValue('font-size')        
    }

    $container: any;
    $canvas: any;
    ePsW: number;
    ePsH: number;
    isDOMElement: boolean;
    $sizeAdjusted: boolean;
    element: any; // DOM element
    $blockElement: any; // DOM element
    border: string;

    constructor() {
        super();
        this.$container = this.$canvas = null;
        this.ePsW = this.ePsH = 0;
        this.isDOMElement = true;   // indication of the DOM element that is used by DOM element manager to track
                                    // and manage its visibility

        this.$sizeAdjusted = false;
    }

    /**
     * Set the CSS font of the wrapped HTML element
     * @param {String|zebkit.ui.Font} f a font
     * @method setFont
     * @chainable
     */
    setFont(f) {
        this.setStyle("font", f.toString());
        this.vrp();
        return this;
    }

    /**
     * Set the CSS color of the wrapped HTML element
     * @param {String} c a color
     * @chainable
     * @method setColor
     */
    setColor(c) {
        this.setStyle("color", c.toString());
        return this;
    }

    /**
     * Apply the given set of CSS styles to the wrapped HTML element
     * @param {Object} styles a dictionary of CSS styles
     * @chainable
     * @method setStyles
     */
    setStyles(styles) {
        for(var k in styles) {
            this.$setStyle(this.element, k, styles[k]);
        }
        this.vrp();
        return this;
    }

    /**
     * Apply the given CSS style to the wrapped HTML element
     * @param {String} a name of the CSS style
     * @param {String} a value the CSS style has to be set
     * @chainable
     * @method setStyle
     */
    setStyle(name, value) {
        this.$setStyle(this.element, name, value);
        this.vrp();
        return this;
    }

    $setStyle(element, name, value) {
        name = name.trim();
        var i = name.indexOf(':');
        if (i > 0) {
            if (zebkit[name.substring(0, i)] == null) {
                return;
            }
            name = name.substring(i + 1);
        }
        element.style[name] = value;
    }

    /**
     * Set the specified attribute of the wrapped HTML element
     * @param {String} name  a name of attribute
     * @param {String} value a value of the attribute
     * @chainable
     * @method setAttribute
     */
    setAttribute(name, value) {
        this.element.setAttribute(name, value);
        return this;
    }

    setAttributes(attrs) {
        for(var name in attrs) {
            this.element.setAttribute(name, attrs[name]);
        }
        return this;
    }

    paint(g) {
        // this method is used as an indication that the component
        // is visible and no one of his parent is invisible
        if (this.$container.style.visibility === "hidden") {
            this.$container.style.visibility = "visible";
        }

        // calling paint says that the component in DOM tree
        // that is time to correct CSS size if necessary
        if (this.$sizeAdjusted !== true) {
            this.setSize(this.width, this.height);
        }
    }

    calcPreferredSize(target) {
        return { width: this.ePsW, height: this.ePsH };
    }

    // the method calculates the given HTML element preferred size
    recalc() {
        // if component has a layout set it is up to a layout manager to calculate
        // the component preferred size. In this case the HTML element is a container
        // whose preferred size is defined by its content
        if (this.layout === this) {
            var e         = this.element,
                vars      = {},
                domParent = null,
                b         = !web.$contains(this.$container);

            // element doesn't have preferred size if it is not a member of
            // an html page, so add it if for a while
            if (b) {
                // save previous parent node since
                // appendChild will overwrite it
                domParent = this.$container.parentNode;
                document.body.appendChild(this.$container);
            }

            // save element metrics
            for(var i = 0; i < $store.length; i++) {
                var k = $store[i];
                vars[k] = e.style[k];
            }

            // force metrics to be calculated automatically
            this.$container.style.visibility = "hidden";
            e.style.padding  = "0px";
            e.style.border   = "none";
            e.style.position = e.style.height = e.style.width = "auto";

            // fetch preferred size
            this.ePsW = e.offsetWidth;
            this.ePsH = e.offsetHeight;

            for(var k in vars) {
                var v = vars[k];
                if (v != null) e.style[k] = v;
            }

            if (b) {
                document.body.removeChild(this.$container);
                // restore previous parent node
                if (domParent != null) domParent.appendChild(this.$container);
            }
        }
    }

    /**
     * Set the inner content of the wrapped HTML element
     * @param {String} an inner content
     * @method setContent
     * @chainable
     */
    setContent(content) {
        this.element.innerHTML = content;
        this.vrp();
        return this;
    }

    $getElementRootFocus() {
        return null;
    }

    canHaveFocus() {
        return this.$getElementRootFocus() != null;
    }

    $focus() {
        if (this.canHaveFocus() && document.activeElement !== this.$getElementRootFocus()) {
            this.$getElementRootFocus().focus();
        }
    };

    $blur() {
        if (this.canHaveFocus() && document.activeElement === this.$getElementRootFocus()) {
            this.$getElementRootFocus().blur();
        }
    }

    toFront() {
        super.toFront();
        var pnode = this.$container.parentNode;
        if (pnode != null && pnode.lastChild !== this.$container) {
            pnode.removeChild(this.$container);
            pnode.appendChild(this.$container);
        }
    }

    toBack(){
        super.toBack();
        var pnode = this.$container.parentNode;
        if (pnode != null && pnode.firstChild !== this.$container) {
            pnode.removeChild(this.$container);
            pnode.insertBefore(this.$container, pnode.firstChild);
        }
    }

    setEnabled(b:any) {
        if (this.isEnabled != b) {
            if (b) {
                this.$container.removeChild(this.$blockElement);
            } else {
                if (this.$blockElement == null) {
                    this.$blockElement = web.$createBlockedElement();
                }
                this.$container.appendChild(this.$blockElement);
           }
        }
        return super.setEnabled(b);
    }

    setSize(w, h) {
        // by the moment the method setSize is called the DOM element can be not a part of
        // HTML layout. In this case offsetWidth/offsetHeihght are always zero what prevents
        // us from proper calculation of CSS width and height. Postpone
        if (web.$contains(this.$container)) {
            var prevVisibility = this.$container.style.visibility;
            this.$container.style.visibility = "hidden"; // could make sizing smooth

            // HTML element size is calculated as sum of CSS "width"/"height", paddings, border
            // So the passed width and height has to be corrected (before it will be applied to
            // an HTML element) by reduction of extra HTML gaps. For this we firstly set the
            // width and size
            this.element.style.width  = "" + w + "px";
            this.element.style.height = "" + h + "px";

            var ww = 2 * w - this.element.offsetWidth,
                hh = 2 * h - this.element.offsetHeight;

            if (ww != w || hh != h) {
                // than we know the component metrics and can compute necessary reductions
                this.element.style.width   = "" + ww + "px";
                this.element.style.height  = "" + hh + "px";
            }

            this.$sizeAdjusted = true;

            // visibility correction is done by HTML elements manager
            this.$container.style.visibility = prevVisibility;
        } else {
            this.$sizeAdjusted = false;
        }

        return super.setSize(w, h);
    }

    setPadding(t,l,b,r) {
        if (arguments.length === 1) {
            l = b = r = t;
        }

        this.setStyles({
            paddingTop    : '' + t + "px",
            paddingLeft   : '' + l + "px",
            paddingRight  : '' + r + "px",
            paddingBottom : '' + b + "px"
        });

        if (this.top !== t || this.left !== l || this.right !== r || this.bottom !== b) {
            // changing padding has influence to CSS size the component has to have
            // so we have to request CSS size recalculation
            this.$sizeAdjusted = false;
        }

        super.setPadding.apply(arguments);
        return this;
    }

    setBorder(b) {
        b = pkg.$view(b);

        if (b == null) {
           this.setStyle("border", "none");
        } else {
            this.setStyles({
                //!!!! bloody FF fix, the border can be made transparent
                //!!!! only via "border" style
                border : "0px solid transparent",

                //!!! FF understands only decoupled border settings
                borderTopStyle : "solid",
                borderTopColor : "transparent",
                borderTopWidth : "" + b.getTop() + "px",

                borderLeftStyle : "solid",
                borderLeftColor : "transparent",
                borderLeftWidth : "" + b.getLeft() + "px",

                borderBottomStyle : "solid",
                borderBottomColor : "transparent",
                borderBottomWidth : "" + b.getBottom() + "px",

                borderRightStyle : "solid",
                borderRightColor : "transparent",
                borderRightWidth : "" + b.getRight() + "px"
            });
        }

        // changing border can have influence to
        // CSS size, so request recalculation of the CSS
        // size
        if (this.border != b) {
            this.$sizeAdjusted = false;
        }

        return super.setBorder(b);
    }

    validate() {
        // lookup root canvas
        if (this.$canvas == null && this.parent != null) {
            this.$canvas = this.getCanvas();
        }

        super.validate();
    }

    function focused() {
        this.$super();

        // sync state of native focus and zebkit focus
        if (this.hasFocus()) {
            this.$focus();
        } else {
            this.$blur();
        }
    },

    function(e) {
        if (e == null) {
            e = "div";
        }

        if (zebkit.isString(e)) {
            e = document.createElement(e);
            if (this.clazz.CLASS_NAME != null) {
                e.setAttribute("class", this.clazz.CLASS_NAME);
            }
            e.style.border   = "0px solid transparent";   // clean up border
            e.style.fontSize = this.clazz.$bodyFontSize;  // DOM element is wrapped with a container that
                                                          // has zero sized font, so let's set body  font
                                                          // for the created element
        }

        // sync padding and margin of the DOM element with
        // what appropriate properties are set
        e.style.margin = e.style.padding = "0px";

        /**
         * Reference to HTML element the UI component wraps
         * @attribute element
         * @readOnly
         * @type {HTMLElement}
         */
        this.element = e;

        // this is set to make possible to use set z-index for HTML element
        this.element.style.position = "relative";


        if (e.parentNode != null && e.parentNode.getAttribute("data-zebcont") != null) {
            throw new Error("DOM element '" + e + "' already has container");
        }

        // container is a DIV element that is used as a wrapper around original one
        // it is done to make HtmlElement implementation more universal making
        // all DOM elements capable to be a container for another one
        this.$container = document.createElement("div");

        // prevent stretching to a parent container element
        this.$container.style.display = "inline-block";

        // cut content
        this.$container.style.overflow = "hidden";

        // it fixes problem with adding, for instance, DOM element as window what can prevent
        // showing components added to popup layer
        this.$container.style["z-index"] = "0";


        // coordinates have to be set to initial zero value in CSS
        // otherwise the DOM layout can be wrong !
        this.$container.style.left = this.$container.style.top = "0px";

        this.$container.visibility = "hidden";  // before the component will be attached
                                                // to parent hierarchy the component has to be hidden

        // container div will always few pixel higher than its content
        // to prevent the bloody effect set font to zero
        // border and margin also have to be zero
        this.$container.style.fontSize = this.$container.style.padding = this.$container.style.padding = "0px";

        // add id
        this.$container.setAttribute("id", "container-" + this.toString());

        // mark wrapper with a special attribute to recognize it exists later
        this.$container.setAttribute("data-zebcont", "true");

        // let html element interact
        this.$container.style["pointer-events"] = "auto";

        // if passed DOM element already has parent
        // attach it to container first and than
        // attach the container to the original parent element
        if (e.parentNode != null) {
            // !!!
            // Pay attention container position cannot be set to absolute
            // since how the element has to be laid out is defined by its
            // original parent
            e.parentNode.replaceChild(this.$container, e);
            this.$container.appendChild(e);
        } else {
            // to force all children element be aligned
            // relatively to the wrapper we have to set
            // position CSS to absolute or absolute
            this.$container.style.position = "absolute";
            this.$container.appendChild(e);
        }

        // set ID if it has not been already defined
        if (e.getAttribute("id") == null) {
            e.setAttribute("id", this.toString());
        }

        this.$super();

        // attach listeners
        if (this.$initListeners != null) {
            this.$initListeners();
        }

        var fe = this.$getElementRootFocus();

        // TODO: may be this code should be moved to web place
        //
        // reg native focus listeners for HTML element that can hold focus
        if (fe != null) {
            var $this = this;

            zebkit.web.$focusin(fe, function(e) {

                // sync native focus with zebkit focus if necessary
                if ($this.hasFocus() === false) {
                    $this.requestFocus();
                }
            }, false);

            zebkit.web.$focusout(fe, function(e) {

                // sync native focus with zebkit focus if necessary
                if ($this.hasFocus()) {
                    pkg.focusManager.requestFocus(null);
                }
            }, false);
        }
    }
}
