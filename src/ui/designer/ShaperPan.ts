/**
 * This is UI component class that implements possibility to embeds another
 * UI components to control the component size and location visually.

        // create canvas
        var canvas = new zebkit.ui.zCanvas(300,300);

        // create two UI components
        var lab = new zebkit.ui.Label("Label");
        var but = new zebkit.ui.Button("Button");

        // add created before label component as target of the shaper
        // component and than add the shaper component into root panel
        canvas.root.add(new zebkit.ui.designer.ShaperPan(lab).properties({
            bounds: [ 30,30,100,40]
        }));

        // add created before button component as target of the shaper
        // component and than add the shaper component into root panel
        canvas.root.add(new zebkit.ui.designer.ShaperPan(but).properties({
            bounds: [ 130,130,100,50]
        }));
*/

/* @class  zebkit.ui.designer.ShaperPan
 * @constructor
 * @extends {zebkit.ui.Panel}
 * @param {zebkit.ui.Panel} target a target UI component whose size and location
 * has to be controlled
 */
import Panel from '../core/Panel';
import BorderLayout from '../../layout/BorderLayout';
import ShaperBorder from './ShaperBorder';
import Cursors from './Cursors';

export default class ShaperPan extends Panel {
    get clazz() {
        return {
            colors: [ "lightGray", "blue" ]
        };
    }

    minHeight: number;
    minWidth: number;
    px: number;
    py: number;

    isResizeEnabled: boolean;
    isMoveEnabled: boolean;

    canHaveFocus: boolean;
    catchInput: boolean;

    colors: string[];
    state: any;

    shaperBr: any; // ShaperBorder

    constructor    (t) {
        super(new BorderLayout());

       /**
        * Indicates if controlled component can be moved
        * @attribute isMoveEnabled
        * @type {Boolean}
        * @default true
        */

       /**
        * Indicates if controlled component can be sized
        * @attribute isResizeEnabled
        * @type {Boolean}
        * @default true
        */

        /**
         * Minimal possible height or controlled component
         * @attribute minHeight
         * @type {Integer}
         * @default 12
         */


        /**
         * Minimal possible width or controlled component
         * @attribute minWidth
         * @type {Integer}
         * @default 12
         */
        this.minHeight = this.minWidth = 12;
        this.canHaveFocus = this.isResizeEnabled = this.isMoveEnabled = true;
        this.state = null;

        this.catchInput = true;

        this.shaperBr = new ShaperBorder();
        this.px = this.py = 0;
        this.setBorder(this.shaperBr);
        if (arguments.length > 0) {
            this.add(t);
        }        
    }

    getCursorType(t, x ,y) {
        return this.kids.length > 0 ? Cursors[this.shaperBr.detectAt(t, x, y)] : null;
    }

    /**
     * Define key pressed events handler
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyPressed
     */
    keyPressed(e) {
        if (this.kids.length > 0){
            var dx = (e.code === ui.KeyEvent.LEFT ? -1 : (e.code === ui.KeyEvent.RIGHT ? 1 : 0)),
                dy = (e.code === ui.KeyEvent.UP   ? -1 : (e.code === ui.KeyEvent.DOWN  ? 1 : 0)),
                w  = this.width  + dx,
                h  = this.height + dy,
                x  = this.x + dx,
                y  = this.y + dy;

            if (e.shiftKey) {
                if (this.isResizeEnabled === true && w > this.shaperBr.gap * 2 && h > this.shaperBr.gap * 2) {
                    this.setSize(w, h);
                }
            } else {
                if (this.isMoveEnabled) {
                    if (x + this.width/2  > 0 &&
                        y + this.height/2 > 0 &&
                        x < this.parent.width  - this.width/2  &&
                        y < this.parent.height - this.height/2    )
                    {
                        this.setLocation(x, y);
                    }
                }
            }
        }
    };

    /**
     * Define pointer drag started events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragStarted
     */
    pointerDragStarted(e){
        this.state = null;
        if (this.isResizeEnabled || this.isMoveEnabled) {
            var t = this.shaperBr.detectAt(this, e.x, e.y);
            if ((this.isMoveEnabled   === true || t !== "center")||
                (this.isResizeEnabled === true || t === "center")  )
            {
                this.state = { top    : (t === "top"    || t === "topLeft"     || t === "topRight"   ) ? 1 : 0,
                                left   : (t === "left"   || t === "topLeft"     || t === "bottomLeft" ) ? 1 : 0,
                                right  : (t === "right"  || t === "topRight"    || t === "bottomRight") ? 1 : 0,
                                bottom : (t === "bottom" || t === "bottomRight" || t === "bottomLeft" ) ? 1 : 0 };

                if (this.state != null) {
                    this.px = e.absX;
                    this.py = e.absY;
                }
            }
        }
    }

    /**
     * Define pointer dragged events handler
     * @param  {zebkit.ui.PointerEvent} e a pointer event
     * @method pointerDragged
     */
    pointerDragged(e){
        if (this.state !== null) {
            var dy = (e.absY - this.py),
                dx = (e.absX - this.px),
                s  = this.state,
                nw = this.width  - dx * s.left + dx * s.right,
                nh = this.height - dy * s.top  + dy * s.bottom;

            if (nw >= this.minWidth && nh >= this.minHeight) {
                this.px = e.absX;
                this.py = e.absY;
                if ((s.top + s.right + s.bottom + s.left) === 0) {
                    this.setLocation(this.x + dx, this.y + dy);
                } else {
                    this.setBounds(this.x + dx * s.left, this.y + dy * s.top, nw, nh);
                //       this.invalidateLayout();
                }
            }
        }
    }

    setColor(b, color) {
        var rp = false;
        if (this.colors == null) {
            this.colors = [ "lightGray", "blue"];
            rp = true;
        }

        var oldCol = this.colors[b?1:0];
        if (oldCol != color) {
            this.colors[b?1:0] = color;
            rp = true;
        }


        var hasFocus = this.hasFocus();
        if (this.shaperBr.color != this.colors[hasFocus?1:0]) {
            this.shaperBr.color = this.colors[hasFocus?1:0];
            rp = true;
        }

        if (rp) {
            this.repaint();
        }
    }

    setColors(col1, col2) {
        this.setColor(false, col1);
        if (col2 != null) {
            this.setColor(true, col2);
        }
    }

    insert(i, constr, d) {
        if (this.kids.length > 0) {
            this.removeAll();
        }

        var top  = this.getTop(),
            left = this.getLeft();

        if (d.width === 0 || d.height === 0) {
            d.toPreferredSize();
        }

        this.setBounds(d.x - left, d.y - top,
                       d.width + left + this.getRight(),
                       d.height + top + this.getBottom());
        super.insert(i, "center", d);
    }

    focused(){
        super.focused();
        this.shaperBr.color = this.colors[this.hasFocus()? 1 : 0];
        this.repaint();
    }
}
