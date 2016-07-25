/**
 *  Root layer implementation. This is the simplest UI layer implementation
 *  where the layer always try grabbing all input event
 *  @class zebkit.ui.RootLayer
 *  @constructor
 *  @extends {zebkit.ui.CanvasLayer}
 */
import CanvasLayer from './CanvasLayer';

class RootLayer extends CanvasLayer {
    $clazz = {
        ID: 'root',
        layout: new zebkit.layout.RasterLayout()
    }

    constructor() {
        super();
    }

    getFocusRoot() {
        return this;
    }
}
