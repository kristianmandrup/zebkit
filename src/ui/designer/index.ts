zebkit.package("ui.designer", function(pkg, Class) {

var ui = zebkit("ui");

/**
 * The package contains number of UI components that can be helpful to
 * make visual control of an UI component size and location
 * @module  ui.designer
 * @main
 */

var CURSORS = {
    left        : ui.Cursor.W_RESIZE,
    right       : ui.Cursor.E_RESIZE,
    top         : ui.Cursor.N_RESIZE,
    bottom      : ui.Cursor.S_RESIZE,
    topLeft     : ui.Cursor.NW_RESIZE,
    topRight    : ui.Cursor.NE_RESIZE,
    bottomLeft  : ui.Cursor.SW_RESIZE,
    bottomRight : ui.Cursor.SE_RESIZE,
    center      : ui.Cursor.MOVE,
    none        : ui.Cursor.DEFAULT
};


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
 


/**
 * @for
 */
});