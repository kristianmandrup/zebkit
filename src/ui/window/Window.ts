/**
 * Window UI component class. Implements window like UI component.
 * The window component has a header, status bar and content areas. The header component
 * is usually placed at the top of window, the status bar component is placed at the bottom and
 * the content component at places the central part of the window. Also the window defines
 * corner UI component that is supposed to be used to resize the window. The window implementation
 * provides the following possibilities:

    - Move window by dragging the window on its header
    - Resize window by dragging the window corner element
    - Place buttons in the header to maximize, minimize, close, etc the window
    - Indicates state of window (active or inactive) by changing
    the widow header style
    - Define a window icon component
    - Define a window status bar component

 * @class zebkit.ui.Window
 *
 * @param {String} [content] a window title
 * @param {zebkit.ui.Panel} [content] a window content
 * @constructor
 * @extends {zebkit.ui.Panel}
 */

import StatePan from '../StatePan';

class CaptionPan extends StatePan {
    state: string;
    constructor() {
        super();
        this.state = "inactive";
    }
}

import Label from '../Label';
import Button from '../Button';
import Panel from '../core/Panel';
import ImagePan from '../core/ImagePan';

function Clazz() {
    this.CaptionPan = CaptionPan;

    this.TitleLab   = Label;
    this.StatusPan  = Panel;
    this.ContentPan = Panel;
    this.SizerIcon  = ImagePan;
    this.Icon       = ImagePan;
    this.Button     = Button;
}

export default class Window extends StatePan {
    get $clazz() {
      return new Clazz();
    }

    isPopupEditor: boolean;
    isSizeable: boolean;
    minSize: number;

    constructor(s?, c?) {
        super();

        var MOVE_ACTION = 1, SIZE_ACTION = 2;

        this.isPopupEditor = true;

        /**
         * Minimal possible size of the window
         * @default 40
         * @attribute minSize
         * @type {Integer}
         */
        this.minSize = 40;

        /**
         * Indicate if the window can be resized by dragging its by corner
         * @attribute isSizeable
         * @type {Boolean}
         * @default true
         * @readOnly
         */
        this.isSizeable = true;
    
        //!!! for some reason state has to be set beforehand
        this.state = "inactive";

        this.prevH = this.prevX = this.prevY = 0;
        this.px = this.py = this.dx = this.dy = 0;
        this.prevW = this.action = -1;

        /**
         * Root window panel. The root panel has to be used to
         * add any UI components
         * @attribute root
         * @type {zebkit.ui.Panel}
         * @readOnly
         */
        this.root = (c == null ? this.createContentPan() : c);

        /**
         * Window caption panel. The panel contains window
         * icons, button and title label
         * @attribute caption
         * @type {zebkit.ui.Panel}
         * @readOnly
         */
        this.caption = this.createCaptionPan();

        /**
         * Window title component
         * @type {zebkit.ui.Panel}
         * @attribute title
         * @readOnly
         */
        this.title = this.createTitle();
        this.title.setValue((s == null ? "" : s));

        /**
         * Icons panel. The panel can contain number of icons.
         * @type {zebkit.ui.Panel}
         * @attribute icons
         * @readOnly
         */
        this.icons = new pkg.Panel(new zebkit.layout.FlowLayout("left", "center", "horizontal", 2));
        this.icons.add(new this.clazz.Icon());

        /**
         * Window buttons panel. The panel can contain number of window buttons
         * @type {zebkit.ui.Panel}
         * @attribute buttons
         * @readOnly
         */
        this.buttons = new pkg.Panel(new zebkit.layout.FlowLayout("center", "center"));

        this.caption.add("center", this.title);
        this.caption.add("left", this.icons);
        this.caption.add("right", this.buttons);

        /**
         * Window status panel.
         * @attribute status
         * @readOnly
         * @type {zebkit.ui.Panel}
         */
        this.status = new this.clazz.StatusPan();
        this.sizer  = new this.clazz.SizerIcon();
        this.status.add(this.sizer);

        this.setSizeable(true);

        this.$super();
        this.setLayout(new zebkit.layout.BorderLayout(2,2));

        this.add("center", this.root);
        this.add("top", this.caption);
        this.add("bottom", this.status);        
    }

    /**
     * Test if the window is shown as a window and activated
     * @return {Boolean} true is the window is shown as internal window and
     * is active.
     * @method isActive
     */
    this.isActive = function() {
        var c = this.getCanvas();
        return c != null && c.getLayer("win").activeWin === this.getWinContainer();
    };

    this.pointerDragStarted = function(e){
        this.px = e.absX;
        this.py = e.absY;
        this.action = this.insideCorner(e.x, e.y) ? (this.isSizeable ? SIZE_ACTION : -1)
                                                  : MOVE_ACTION;
        if (this.action > 0) {
            this.dy = this.dx = 0;
        }
    };

    this.pointerDragged = function(e){
        if (this.action > 0) {
            if (this.action !== MOVE_ACTION){
                var container = this.getWinContainer(),
                    nw = this.dx + container.width,
                    nh = this.dy + container.height;

                if (nw > this.minSize && nh > this.minSize) {
                    container.setSize(nw, nh);
                }
            }

            this.dx = (e.absX - this.px);
            this.dy = (e.absY - this.py);
            this.px = e.absX;
            this.py = e.absY;
            if (this.action === MOVE_ACTION){
                var container = this.getWinContainer();
                container.setLocation(this.dx + container.x, this.dy + container.y);
            }
        }
    };

    this.pointerDragEnded = function(e){
        if (this.action > 0){
            if (this.action === MOVE_ACTION){
                var container = this.getWinContainer();
                container.setLocation(this.dx + container.x, this.dy + container.y);
            }
            this.action = -1;
        }
    };

    this.getWinContainer = function() {
        return this;
    };

    /**
     * Test if the pointer cursor is inside the window corner component
     * @protected
     * @param  {Integer} px a x coordinate of the pointer cursor
     * @param  {Integer} py a y coordinate of the pointer cursor
     * @return {Boolean}  true if the pointer cursor is inside window
     * corner component
     * @method insideCorner
     */
    this.insideCorner = function(px,py){
        return this.getComponentAt(px, py) === this.sizer;
    };

    this.getCursorType = function(target,x,y){
        return (this.isSizeable && this.insideCorner(x, y)) ? pkg.Cursor.SE_RESIZE
                                                            : null;
    };

    this.catchInput = function(c){
        var tp = this.caption;
        return c === tp || (zebkit.layout.isAncestorOf(tp, c)         &&
                zebkit.instanceOf(c, pkg.Button) === false) ||
                this.sizer === c;
    };

    this.winOpened = function(e) {
        var state = this.isActive() ? "active" : "inactive";
        if (this.caption != null && this.caption.setState != null) {
            this.caption.setState(state);
        }
        this.setState(state);
    };

    this.winActivated = function(e) {
        this.winOpened(e);
    };

    this.pointerDoubleClicked = function (e){
        var x = e.x, y = e.y, cc = this.caption;
        if (this.isSizeable === true && x > cc.x &&
            x < cc.y + cc.width && y > cc.y && y < cc.y + cc.height)
        {
            if (this.prevW < 0) this.maximize();
            else this.restore();
        }
    };

    /**
     * Test if the window has been maximized to occupy the whole
     * window layer space.
     * @return {Boolean} true if the window has been maximized
     * @method isMaximized
     */
    this.isMaximized = function() {
        return this.prevW != -1;
    };

    this.createCaptionPan = function() {
        return new this.clazz.CaptionPan();
    };

    this.createContentPan = function() {
        return new this.clazz.ContentPan();
    };

    this.createTitle = function() {
        return new this.clazz.TitleLab();
    };

    this.setIcon = function(i, icon) {
        if (zebkit.isString(icon) || zebkit.instanceOf(icon, pkg.Picture)) {
            icon = new pkg.ImagePan(icon);
        }
        this.icons.setAt(i, icon);
        return this;
    };

    /**
     * Make the window sizable or not sizeable
     * @param {Boolean} b a sizeable state of the window
     * @method setSizeable
     */
    this.setSizeable = function(b){
        if (this.isSizeable != b){
            this.isSizeable = b;
            if (this.sizer != null) {
                this.sizer.setVisible(b);
            }
        }
        return this;
    };

    /**
     * Maximize the window
     * @method maximize
     */
    this.maximize = function(){
        if(this.prevW < 0){
            var d    = this.getCanvas(),
                cont = this.getWinContainer(),
                left = d.getLeft(),
                top  = d.getTop();

            this.prevX = cont.x;
            this.prevY = cont.y;
            this.prevW = cont.width;
            this.prevH = cont.height;

            cont.setBounds(left, top,
                            d.width  - left - d.getRight(),
                            d.height - top - d.getBottom());
        }
    };

    /**
     * Restore the window size
     * @method restore
     */
    this.restore = function(){
        if (this.prevW >= 0){
            this.getWinContainer().setBounds(this.prevX, this.prevY,
                                              this.prevW, this.prevH);
            this.prevW = -1;
        }
    };

    /**
     * Close the window
     * @method close
     */
    this.close = function() {
        this.getWinContainer().removeMe();
    };

    /**
     * Set the window buttons set.
     * @param {Object} buttons dictionary of buttons icons for window buttons.
     * The dictionary key defines a method of the window component to be called
     * when the given button has been pressed. So the method has to be defined
     * in the window component.
     * @method setButtons
     */
    this.setButtons = function(buttons) {
        // remove previously added buttons
        for(var i=0; i< this.buttons.length; i++) {
            var kid = this.buttons.kids[i];
            if (kid._ != null) kid.unbind();
        }
        this.buttons.removeAll();

        // add new buttons set
        for(var k in buttons) {
            if (buttons.hasOwnProperty(k)) {
                var b = new this.clazz.Button();
                b.setView(buttons[k]);
                this.buttons.add(b);
                (function(t, f) {
                    b.bind(function() { f.call(t); });
                })(this, this[k]);
            }
        }
        return this;
    }

    // static

    focused() {
        super.focused();
        if (this.caption != null) {
            this.caption.repaint();
        }
    }
}



