import Panel from '../ui/Panel';
import util from '../util';
import utils from '../utils';
import $ViewsSetterMix from '../';

/**
 * Base UI list component class that has to be extended with a
 * concrete list component implementation. The list component
 * visualizes list data model (zebkit.data.ListModel).
 * @class  zebkit.ui.BaseList
 * @extends {zebkit.ui.Panel}
 */

/**
 * Fire when a list item has been selected:

        list.bind(function selected(src, prev) {
            ...
        });

 * @event selected
 * @param {zebkit.ui.BaseList} src a list that triggers the event
 * @param {Integer|Object} prev a previous selected index, return null if the selected item has been re-selected
 */
export default class BaseList extends Panel, util.Position.Metric, $ViewsSetterMix {
    $clazz = {
        Listeners: util.ListenersClass("selected")
    }

    canHaveFocus: boolean;
    selectedIndex: number;
    isComboMode: boolean;
    scrollManager: any;
    _: any;
    position: any; // util.Position

    constructor(m, b) {
        super();
        if (b == null) b = false;
        if (m == null) m = [];
        else {
            if (utils.isBoolean(m)) {
                b = m;
                m = [];
            }
        }

        /**
         * Currently selected list item index
         * @type {Integer}
         * @attribute selectedIndex
         * @default -1
         * @readOnly
         */
        this.selectedIndex = -1;

        this._ = new this.clazz.Listeners();

        /**
         * Indicate the current mode the list items selection has to work
         * @readOnly
         * @default false
         * @attribute isComboMode
         * @type {Boolean}
         */
        this.isComboMode = b;

        /**
         * Scroll manager
         * @attribute scrollManager
         * @readOnly
         * @protected
         * @type {zebkit.ui.ScrollManager}
         */
        this.scrollManager = new pkg.ScrollManager(this);

        // position manager should be set before model initialization
        this.setPosition(new zebkit.util.Position(this));

        /**
         * List model
         * @readOnly
         * @attribute model
         */
        this.setModel(m);
        this.canHaveFocus = true;
    }

    /**
     * List model the component visualizes
     * @attribute model
     * @type {zebkit.data.ListModel}
     * @readOnly
     */

    /**
     * Select the specified list item.
     * @param {Object} v a list item to be selected. Use null as
     * the parameter value to clean an item selection
     * @return {Integer} an index of a selected item
     * @method setValue
     */
    setValue(v) {
        if (v == null) {
            this.select(-1);
        } else {
            if (this.model != null) {
                for(var i = 0; i < this.model.count(); i++) {
                    if (this.model.get(i) === v && this.isItemSelectable(i)) {
                        this.select(i);
                        return i;
                    }
                }
            }
        }
        return -1;
    }

    /**
     * Get the list component selected item
     * @return {Object} a selected item
     * @method getValue
     */
    getValue() {
        return this.getSelected();
    }

    /**
     * Test if the given item is selectable.
     * @param  {Integer}  i an item index
     * @return {Boolean}  true if the given item is selectable
     * @method isItemSelectable
     */
    isItemSelectable(i) {
        return true;
    }

    /**
     * Get selected list item
     * @return {Object} an item
     * @method getSelected
     */
    getSelected(){
        return this.selectedIndex < 0 ? null
                                        : this.model.get(this.selectedIndex);
    }

    lookupItem(ch){
        var count = this.model == null ? 0 : this.model.count();
        if (zebkit.util.isLetter(ch) && count > 0){
            var index = this.selectedIndex < 0 ? 0 : this.selectedIndex + 1;
            ch = ch.toLowerCase();
            for(var i = 0;i < count - 1; i++){
                var idx = (index + i) % count, item = this.model.get(idx).toString();
                if (this.isItemSelectable(idx) && item.length > 0 && item[0].toLowerCase() === ch) {
                    return idx;
                }
            }
        }
        return -1;
    }

    /**
     * Test if the given list item is selected
     * @param  {Integer}  i an item index
     * @return {Boolean}  true if the item with the given index is selected
     * @method isSelected
     */
    isSelected(i) {
        return i === this.selectedIndex;
    }

    /**
     * Called when a pointer (pointer or finger on touch screen) is moved
     * to a new location
     * @param  {Integer} x a pointer x coordinate
     * @param  {Integer} y a pointer y coordinate
     * @method $pointerMoved
     * @protected
     */
    $pointerMoved(x, y){
        if (this.isComboMode === true && this.model != null) {
            var index = this.getItemIdxAt(x, y);
            if (index != this.position.offset && (index < 0 || this.isItemSelectable(index) === true)) {
                this.$triggeredByPointer = true;

                if (index < 0) this.position.setOffset(null);
                else this.position.setOffset(index);
                this.notifyScrollMan(index);

                this.$triggeredByPointer = false;
            }
        }
    }

    /**
     * Return the given list item location.
     * @param  {Integer} i a list item index
     * @return {Object}  a location of the list item. The result is object that
     * has the following structure:
            { x:{Integer}, y:{Integer} }
        * @method getItemLocation
        */
    getItemLocation(i) {
        this.validate();
        var y = this.getTop() + this.scrollManager.getSY();

        for(var i = 0;i < index; i++) {
            y += this.getItemSize(i).height;
        }

        return { x:this.getLeft(), y:y };
    }

    /**
     * Return the given list item size.
     * @param  {Integer} i a list item index
     * @return {Object}  a size of the list item. The result is object that
     * has the following structure:
            { width:{Integer}, height:{Integer} }
        * @method getItemSize
        */
    getItemSize(i){
        throw new Error("Not implemented");
    };

    getLines() {
        return this.model == null ? 0 : this.model.count();
    }

    getLineSize = function(l) {
        return 1;
    }

    getMaxOffset = function() {
        return this.getLines() - 1;
    }

    catchScrolled = function(psx,psy) {
        this.repaint();
    }

    /**
     * Detect an item by the specified location
     * @param  {Integer} x a x coordinate
     * @param  {Integer} y a y coordinate
     * @return {Integer} a list item that is located at the given position.
     * -1 if no any list item can be found.
     * @method getItemIdxAt
     */
    getItemIdxAt = function(x,y) {
        return -1;
    }

    /**
     * Calculate maximal width and maximal height the items in the list have
     * @protected
     * @return {Integer} a max items size
     * @method calcMaxItemSize
     */
    calcMaxItemSize(){
        var maxH = 0, maxW = 0;
        this.validate();
        if (this.model != null) {
            for(var i = 0;i < this.model.count(); i ++ ){
                var is = this.getItemSize(i);
                if (is.height > maxH) maxH = is.height;
                if (is.width  > maxW) maxW = is.width;
            }
        }
        return { width:maxW, height:maxH };
    }

    /**
     * Force repainting of the given list items
     * @protected
     * @param  {Integer} p an index of the first list item to be repainted
     * @param  {Integer} n an index of the second list item to be repainted
     * @method repaintByOffsets
     */
    repaintByOffsets(p,n){
        this.validate();
        var xx    = this.width - this.getRight(),
            count = this.model == null ? 0 : this.model.count();

        if (p >= 0 && p < count){
            var l = this.getItemLocation(p);
            this.repaint(l.x, l.y, xx - l.x, this.getItemSize(p).height);
        }

        if (n >= 0 && n < count){
            var l = this.getItemLocation(n);
            this.repaint(l.x, l.y, xx - l.x, this.getItemSize(n).height);
        }
    }

    /**
     * Draw the given list view element identified by the given id
     * on the given list item.
     * @param  {2DGraphics} g     a graphical context
     * @param  {String}     id    a view id
     * @param  {Integer}    index a list item index
     * @protected
     * @method drawViewAt
     */
    drawViewAt(g, id, index) {
        if (index >= 0 && this.views[id] != null && this.isItemSelectable(index)) {
            var is  = this.getItemSize(index),
                l   = this.getItemLocation(index);

            this.drawView(g, id, this.views[id],
                            l.x, l.y,
                            is.width ,
                            is.height);
        }
    }

    /**
     * Draw the given list view element identified by the given id
     * at the specified location.
     * @param  {2DGraphics} g     a graphical context
     * @param  {String}     id    a view id
     * @param  {Integer}    x a x coordinate the view has to be drawn
     * @param  {Integer}    y a y coordinate the view has to be drawn
     * @param  {Integer}    w a view width
     * @param  {Integer}    h a view height
     * @protected
     * @method drawView
     */
    drawView(g, id, v, x, y, w ,h) {
        this.views[id].paint(g, x, y, w, h, this);
    }

    update(g) {
        if (this.isComboMode === true || this.hasFocus())  {
            this.drawViewAt(g, "marker", this.position.offset);
        }
        this.drawViewAt(g, "select", this.selectedIndex);
    }

    paintOnTop = function(g) {
        if (this.isComboMode === true || this.hasFocus())  {
            this.drawViewAt(g, "top.marker", this.position.offset);
        }
    }

    /**
     * Select the given list item
     * @param  {Integer} index an item index to be selected
     * @method select
     */
    select(index){
        if (index == null) {
            throw new Error("Null index");
        }

        if (this.model != null && index >= this.model.count()){
            throw new RangeError(index);
        }

        if (this.selectedIndex != index) {
            if (index < 0 || this.isItemSelectable(index)) {
                var prev = this.selectedIndex;



                this.selectedIndex = index;
                this.notifyScrollMan(index);
                this.repaintByOffsets(prev, this.selectedIndex);
                this.fireSelected(prev);
            }
        } else {
            this.fireSelected(null);
        }
    }

    /**
     * Fire selected event
     * @param  {Integer|null} prev a previous selected item index. null if the
     * same item has been re-selected
     * @method fireSelected
     * @protected
     */
    fireSelected(prev) {
        this._.selected(this, prev);
    }

    pointerClicked(e) {
        if (this.model != null && e.isAction() && this.model.count() > 0) {
            this.$select(this.position.offset < 0 ? 0 : this.position.offset);
        }
    }

    pointerReleased(e){
        if (this.model != null     &&
            this.model.count() > 0 &&
            e.isAction()           &&
            this.position.offset != this.selectedIndex)
        {
            this.position.setOffset(this.selectedIndex);
        }
    }

    pointerPressed(e){
        if (e.isAction() && this.model != null && this.model.count() > 0) {
            var index = this.getItemIdxAt(e.x, e.y);
            if (index >= 0 && this.position.offset != index && this.isItemSelectable(index)) {
                this.position.setOffset(index);
            }
        }
    }

    pointerDragged(e){
        this.$pointerMoved(e.x, e.y);
    }

    pointerMoved(e) {
        this.pointerDragged(e);
    } 
    
    pointerEntered(e) {
        this.pointerDragged(e);
    }

    pointerExited(e){
        this.$pointerMoved(-10, -10);
    }

    pointerDragEnded(e){
        if (this.model != null && this.model.count() > 0 && this.position.offset >= 0) {
            this.select(this.position.offset < 0 ? 0 : this.position.offset);
        }
    }

    keyPressed(e){
        if (this.model != null && this.model.count() > 0){
            var po = this.position.offset;
            switch(e.code) {
                case pkg.KeyEvent.END:
                    if (e.ctrlKey) {
                        this.position.setOffset(this.position.metrics.getMaxOffset());
                    } else {
                        this.position.seekLineTo("end");
                    }
                    break;
                case pkg.KeyEvent.HOME:
                    if (e.ctrlKey) this.position.setOffset(0);
                    else this.position.seekLineTo("begin");
                    break;
                case pkg.KeyEvent.RIGHT    : this.position.seek(1); break;
                case pkg.KeyEvent.DOWN     : this.position.seekLineTo("down"); break;
                case pkg.KeyEvent.LEFT     : this.position.seek(-1);break;
                case pkg.KeyEvent.UP       : this.position.seekLineTo("up");break;
                case pkg.KeyEvent.PAGEUP   : this.position.seek(this.pageSize(-1));break;
                case pkg.KeyEvent.PAGEDOWN : this.position.seek(this.pageSize(1));break;
                case pkg.KeyEvent.SPACE    :
                case pkg.KeyEvent.ENTER    : this.$select(this.position.offset); break;
            }
        }
    }

    /**
     * Select the given list item. The method is called when an item
     * selection is triggered by a user interaction: key board, or pointer
     * @param  {Integer} o an item index
     * @method $select
     * @protected
     */
    $select(o) {
        this.select(o);
    }

    /**
     * Define key typed events handler
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyTyped
     */
    keyTyped(e){
        var i = this.lookupItem(e.ch);
        if (i >= 0) this.$select(i);
    }

    elementInserted(target, e,index){
        this.invalidate();
        if (this.selectedIndex >= 0 && this.selectedIndex >= index) {
            this.selectedIndex++;
        }
        this.position.inserted(index, 1);
        this.repaint();
    }

    elementRemoved(target, e,index){
        this.invalidate();
        if (this.selectedIndex == index || this.model.count() === 0) {
            this.select(-1);
        } else {
            if (this.selectedIndex > index) {
                this.selectedIndex--;
            }
        }
        this.position.removed(index, 1);
        this.repaint();
    }

    elementSet(target, e, pe,index){
        if (this.selectedIndex == index) {
            this.select(-1);
        }
        this.vrp();
    }

    /**
     * Find a next selectable list item starting from the given offset
     * with the specified direction
     * @param  {Integer} off a start item index to perform search
     * @param  {Integer} d   a direction increment. Cam be -1 or 1
     * @return {Integer} a next selectable item index
     * @method findSelectable
     * @protected
     */
    findSelectable(off, d) {
        var c = this.model.count(), i = 0, dd = Math.abs(d);
        while (this.isItemSelectable(off) === false && i < c) {
            off = (c + off + d) % c;
            i += dd;
        }
        return i < c ? off : -1;
    }

    posChanged(target,prevOffset,prevLine,prevCol){
        var off = this.position.offset;
        if (off >= 0) {
            off = this.findSelectable(off, prevOffset < off ? 1 : -1);

            if (off != this.position.offset) {
                this.position.setOffset(off);
                this.repaintByOffsets(prevOffset, off);
                return;
            }
        }

        if (this.isComboMode === true) {
            this.notifyScrollMan(off);
        } else {
            this.select(off);
        }

        // this.notifyScrollMan(off);
        this.repaintByOffsets(prevOffset, off);
    }


    /**
     * Set the list model to be rendered with the list component
     * @param {zebkit.data.ListModel} m a list model
     * @method setModel
     * @chainable
     */
    setModel(m){
        if (m != this.model){
            if (m != null && Array.isArray(m)) {
                m = new zebkit.data.ListModel(m);
            }

            if (this.model != null && this.model._ != null) this.model.unbind(this);
            this.model = m;
            if (this.model != null && this.model._ != null) this.model.bind(this);
            this.vrp();
        }
        return this;
    }

    /**
     * Set the given position controller. List component uses position to
     * track virtual cursor.
     * @param {zebkit.util.Position} c a position
     * @method setPosition
     */
    setPosition(c){
        if (c != this.position) {
            if (this.position != null) {
                this.position.unbind(this);
            }
            this.position = c;
            this.position.bind(this);
            this.position.setMetric(this);
            this.repaint();
        }
    }

    /**
     * Set the list items view provider. Defining a view provider allows developers
     * to customize list item rendering.
     * @param {Object|Function} v a view provider class instance or a function that
     * says which view has to be used for the given list model data. The function
     * has to satisfy the following method signature: "function(list, modelItem, index)"
     * @method setViewProvider
     */
    setViewProvider(v){
        if (this.provider != v){
            if (typeof v  == "function") {
                var o = new zebkit.Dummy();
                o.getView = v;
                v = o;
            }

            this.provider = v;
            this.vrp();
        }
        return this;
    }

    notifyScrollMan(index){
        if (index >= 0 && this.scrollManager != null) {
            this.validate();
            var is = this.getItemSize(index);

            if (is.width > 0 && is.height > 0) {
                var l = this.getItemLocation(index);
                this.scrollManager.makeVisible(l.x - this.scrollManager.getSX(),
                                                l.y - this.scrollManager.getSY(),
                                                is.width, is.height);
            }
        }
    }

    /**
     * The method returns the page size that has to be scroll up or down
     * @param  {Integer} d a scrolling direction. -1 means scroll up, 1 means scroll down
     * @return {Integer} a number of list items to be scrolled
     * @method pageSize
     * @protected
     */
    pageSize(d){
        var offset = this.position.offset;
        if (offset >= 0) {
            var vp = pkg.$cvp(this, {});
            if (vp != null) {
                var sum = 0, i = offset;
                for(;i >= 0 && i <= this.position.metrics.getMaxOffset() && sum < vp.height; i += d){
                    sum += (this.getItemSize(i).height);
                }
                return i - offset - d;
            }
        }
        return 0;
    }


    /**
     * Sets the views for the list visual elements. The following elements are
     * supported:

        - "select" -  a selection view element
        - "top.marker" - a position marker view element that is rendered  on top of list item
        - "marker" - a position marker view element

        * @param {Object} views view elements
        * @method setViews
        */

    focused(){
        super.focused();
        this.repaint();
    }
}
