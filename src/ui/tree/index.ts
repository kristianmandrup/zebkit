export { default as BaseTree } from './BaseTree';
export { default as CompTree } from './CompTree';
export { default as DefEditors } from './DefaultEditors';
export { default as DefViews } from './DefaultViews'; 

/**
 * Tree UI components and all related to the component classes and interfaces.
 * Tree components are graphical representation of a tree model that allows a user
 * to navigate over the model item, customize the items rendering and
 * organize customizable editing of the items.

        // create tree component instance to visualize the given tree model
        var tree = new zebkit.ui.tree.Tree({
            value: "Root",
            kids : [
                "Item 1",
                "Item 2",
                "Item 3"
            ]
        });

        // make all tree items editable with text field component
        tree.setEditorProvider(new zebkit.ui.tree.DefEditors());

 * One more tree  component implementation - "CompTree" - allows developers
 * to create tree whose nodes are  other UI components

        // create tree component instance to visualize the given tree model
        var tree = new zebkit.ui.tree.CompTree({
            value: new zebkit.ui.Label("Root label item"),
            kids : [
                new zebkit.ui.Checkbox("Checkbox Item"),
                new zebkit.ui.Button("Button Item"),
                new zebkit.ui.TextField("Text field item")
            ]
        });

 * @module ui.tree
 * @main
 */

//  tree node metrics:
//   |
//   |-- <-gapx-> {icon} -- <-gapx-> {view}
//

/**
 * Simple private structure to keep a tree model item metrical characteristics
 * @constructor
 * @param {Boolean} b a state of an appropriate tree component node of the given
 * tree model item. The state is sensible for item that has children items and
 * the state indicates if the given tree node is collapsed (false) or expanded
 * (true)
 * @private
 * @class zebkit.ui.tree.$IM
 */
export function $IM(b) {
    /**
     *  The whole width of tree node that includes a rendered item preferred
     *  width, all icons and gaps widths
     *  @attribute width
     *  @type {Integer}
     *  @readOnly
     */

    /**
     *  The whole height of tree node that includes a rendered item preferred
     *  height, all icons and gaps heights
     *  @attribute height
     *  @type {Integer}
     *  @readOnly
     */

    /**
     *  Width of an area of rendered tree model item. It excludes icons, toggle
     *  and gaps widths
     *  @attribute viewWidth
     *  @type {Integer}
     *  @readOnly
     */

    /**
     *  Height of an area of rendered tree model item. It excludes icons, toggle
     *  and gaps heights
     *  @attribute viewHeight
     *  @type {Integer}
     *  @readOnly
     */

    /**
     *  Indicates whether a node is in expanded or collapsed state
     *  @attribute isOpen
     *  @type {Boolean}
     *  @readOnly
     */

    this.width = this.height = this.x = this.y = this.viewHeight = 0;
    this.viewWidth = -1;
    this.isOpen = b;
};
