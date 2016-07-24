/**
 * Simple grid cells editors provider implementation. By default the editors provider
 * uses a text field component or check box component as a cell content editor. Check
 * box component is used if a cell data type is boolean, otherwise text filed is applied
 * as the cell editor.

        // grid with tree columns and three rows
        // first and last column will be editable with text field component
        // second column will be editable with check box component
        var grid = new zebkit.ui.grid.Grid([
            ["Text Cell", true, "Text cell"],
            ["Text Cell", false, "Text cell"],
            ["Text Cell", true, "Text cell"]
        ]);

        // make grid cell editable
        grid.setEditorProvider(new zebkit.ui.grid.DefEditors());


 * It is possible to customize a grid column editor by specifying setting "editors[col]" property
 * value. You can define an UI component that has to be applied as an editor for the given column
 * Also you can disable editing by setting appropriate column editor class to null:

        // grid with tree columns and three rows
        // first and last column will be editable with text field component
        // second column will be editable with check box component
        var grid = new zebkit.ui.grid.Grid([
            ["Text Cell", true, "Text cell"],
            ["Text Cell", false, "Text cell"],
            ["Text Cell", true, "Text cell"]
        ]);

        // grid cell editors provider
        var editorsProvider = new zebkit.ui.grid.DefEditors();

        // disable the first column editing
        editorsProvider.editors[0] = null;

        // make grid cell editable
        grid.setEditorProvider(editorsProvider);

 * @constructor
 * @class zebkit.ui.grid.DefEditors
 */
class DefEditors {
    function $clazz() {
        this.TextField = Class(ui.TextField, []);
        this.Checkbox  = Class(ui.Checkbox,  []);
        this.Combo     = Class(ui.Combo,     [
            function padShown(src, b) {
                if (b === false) {
                    this.parent.stopEditing(true);
                    this.setSize(0,0);
                }
            },

            function resized(pw, ph) {
                this.$super(pw, ph);
                if (this.width > 0 && this.height > 0 && this.hasFocus()) {
                    this.showPad();
                }
            }
        ]);

        this.Items = Class([
            function $prototype() {
                this.toString = function() {
                    return this.selectedIndex < 0 ? ""
                                                  : this.items[this.selectedIndex];
                };
            },

            function(items, selectedIndex) {
                if (arguments.length < 2) {
                    selectedIndex = -1;
                }

                this.items = items;
                this.selectedIndex = selectedIndex;
            }
        ]);
    },

    function $prototype() {
        this[''] = function() {
            this.textEditor     = new this.clazz.TextField("", 150);
            this.boolEditor     = new this.clazz.Checkbox(null);
            this.selectorEditor = new this.clazz.Combo();

            this.editors    = {};
        };

        /**
         * Fetch an edited value from the given UI editor component.
         * @param  {zebkit.ui.grid.Grid} grid a target grid component
         * @param  {Integer} row a grid cell row that has been edited
         * @param  {Integer} col a grid cell column that has been edited
         * @param  {Object} data an original cell content
         * @param  {zebkit.ui.Panel} editor an editor that has been used to
         * edit the given cell
         * @return {Object} a value that can be applied as a new content of
         * the edited cell content
         * @method  fetchEditedValue
         */
        this.fetchEditedValue = function(grid,row,col,data,editor) {
            if (editor === this.selectorEditor) {
                data.selectedIndex = editor.list.selectedIndex;
                return data;
            }
            return editor.getValue();
        };

        /**
         * Get an editor UI component to be used for the given cell of the specified grid
         * @param  {zebkit.ui.grid.Grid} grid a grid whose cell is going to be edited
         * @param  {Integer} row  a grid cell row
         * @param  {Integer} col  a grid cell column
         * @param  {Object}  v    a grid cell model data
         * @return {zebkit.ui.Panel} an editor UI component to be used to edit the given cell
         * @method  getEditor
         */
        this.getEditor = function(grid, row, col, v) {
            var editor = this.editors[col];
            if (editor != null) {
                editor.setValue(v);
                return editor;
            }

            editor = zebkit.isBoolean(v) ? this.boolEditor
                                        : (zebkit.instanceOf(v, this.clazz.Items) ? this.selectorEditor : this.textEditor);

            if (editor === this.selectorEditor) {
                editor.list.setModel(v.items);
                editor.list.select(v.selectedIndex);
            } else {
                editor.setValue(v);
            }

            editor.setPadding(0);
            var ah = Math.floor((grid.getRowHeight(row) - editor.getPreferredSize().height)/2);
            editor.setPadding(ah, grid.cellInsetsLeft, ah, grid.cellInsetsRight);
            return editor;
        };

        /**
         * Test if the specified input event has to trigger the given grid cell editing
         * @param  {zebkit.ui.grid.Grid} grid a grid
         * @param  {Integer} row  a grid cell row
         * @param  {Integer} col  a grid cell column
         * @param  {zebkit.util.Event} e  an event to be evaluated
         * @return {Boolean} true if the given input event triggers the given cell editing
         * @method shouldStart
         */
        this.shouldStart = function(grid,row,col,e){
            return e.id === "pointerClicked";
        };

        /**
         * Test if the specified input event has to canceling the given grid cell editing
         * @param  {zebkit.ui.grid.Grid} grid a grid
         * @param  {Integer} row  a grid cell row
         * @param  {Integer} col  a grid cell column
         * @param  {zebkit.util.Event} e  an event to be evaluated
         * @return {Boolean} true if the given input event triggers the given cell editing
         * cancellation
         * @method shouldCancel
         */
        this.shouldCancel = function(grid,row,col,e){
            return e.id === "keyPressed" && ui.KeyEvent.ESCAPE === e.code;
        };

        /**
         * Test if the specified input event has to trigger finishing the given grid cell editing
         * @param  {zebkit.ui.grid.Grid} grid [description]
         * @param  {Integer} row  a grid cell row
         * @param  {Integer} col  a grid cell column
         * @param  {zebkit.util.Event} e  an event to be evaluated
         * @return {Boolean} true if the given input event triggers finishing the given cell editing
         * @method shouldFinish
         */
        this.shouldFinish = function(grid,row,col,e){
            return e.id === "keyPressed" && ui.KeyEvent.ENTER === e.code;
        };
    }
}
