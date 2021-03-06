
/**
 * Event manager class. One of the key zebkit manager that is responsible for
 * distributing various events in zebkit UI. The manager provides number of
 * methods to register global events listeners.
 * @class zebkit.ui.EventManager
 * @constructor
 * @extends {zebkit.ui.Manager}
 */
import Manager from './Manager';
import { eventNames } from './events'
import { ListenersClass} from '../../utils/listen';

function Clazz() {
        this.$CHILD_EVENTS_MAP = {};

        // add child<eventName> events names
        var l = eventNames.length;
        for(var i = 0; i < l; i++) {
            var eventName = eventNames[i];
            eventNames.push("child" + eventName[0].toUpperCase() + eventName.substring(1));
            this.$CHILD_EVENTS_MAP[eventName] = eventNames[l + i];
        }

        this.Listeners = ListenersClass.apply(this, eventNames);
}

export default class EventManager extends Manager {
    get clazz() {
        return new Clazz();
    }

    $CEM: any;
    _: any;

    constructor(clazz) {
        super();
        this.$CEM = clazz.$CHILD_EVENTS_MAP;
        this._ = new this.clazz.Listerners();        
    }

    fireEvent(id, e){
        var t = e.source, kk = this.$CEM[id], b = false;

        // assign id that matches method to be called
        e.id = id;

        // call target component listener
        if (t[id] != null) {
            if (t[id].call(t, e) === true) {
                return true;
            }
        }

        // call global listeners
        b = this._[id](e);

        // call parent listeners
        if (b === false) {
            for (t = t.parent;t != null; t = t.parent){
                if (t[kk] != null) {
                    t[kk].call(t, e);
                }
            }
        }

        return b;
    }
}