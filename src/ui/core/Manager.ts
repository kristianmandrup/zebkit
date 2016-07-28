/**
 *  UI manager class. The class is widely used as base for building
 *  various UI managers like paint, focus, event etc. Manager is
 *  automatically registered as input and component events listener
 *  if it implements appropriate events methods handlers
 *  @class zebkit.ui.Manager
 *  @constructor
 */
export default class Manager {
    constructor(events) {
        if (events != null) {
            events.bind(this);
        }
    }
}
