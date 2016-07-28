/**
 * Zebkit UI. The UI is powerful way to create any imaginable
 * user interface for WEB. The idea is based on developing
 * hierarchy of UI components that sits and renders on HTML5
 * Canvas element.
 *
 * Write zebkit UI code in safe place where you can be sure all
 * necessary structure, configurations, etc are ready. The safe
 * place is "zebkit.ready(...)" method. Development of zebkit UI
 * application begins from creation "zebkit.ui.zCanvas" class,
 * that is starting point and root element of your UI components
 * hierarchy. "zCanvas" is actually wrapper around HTML5 Canvas
 * element where zebkit UI sits on. The typical zebkit UI coding
 * template is shown below:

     // build UI in safe place
     zebkit.ready(function() {
        // create canvas element
        var c = new zebkit.ui.zCanvas(400, 400);

        // start placing UI component on c.root panel
        //set layout manager
        c.root.setLayout(new zebkit.layout.BorderLayout());
        //add label to top
        c.root.add("top",new zebkit.ui.Label("Top label"));
        //add text area to center
        c.root.add("center",new zebkit.ui.TextArea(""));
        //add button area to bottom
        c.root.add("bottom",new zebkit.ui.Button("Button"));
        ...
     });

 *  The latest version of zebkit JavaScript is available in repository:

        <script src='http://repo.zebkit.org/latest/zebkit.min.js'
                type='text/javascript'></script>

 * @module ui
 * @main ui
 * @requires zebkit, util, io, data
 */

export { default as CanvasLayer } from './CanvasLayer';
export { default as Cursor } from './Cursor';
export { default as CursorManager } from './CursorManager';
export { default as EventManager } from './EventManager';
export { default as FocusManager } from './FocusManager';
export { default as HtmlCanvas } from './HtmlCanvas';
export { default as ImagePan } from './ImagePan';
export { default as Manager } from './Manager';
export { default as Panel } from './Panel';
export { default as RootLayer } from './RootLayer';
export { default as ShortcutManager } from './ShortcutManager';
export { default as ViewPan } from './ViewPan';
export { default as zCanvas } from './zCanvas';

import * as _utils from './utils';
export const utils = _utils;
