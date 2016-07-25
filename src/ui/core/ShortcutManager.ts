/**
 *  Command manager supports short cut keys definition and listening. The shortcuts have to be defined in
 *  zebkit JSON configuration files. There are two sections:

    - **osx** to keep shortcuts for Mac OS X platform
    - **common** to keep shortcuts for all other platforms

 *  The JSON configuration entity has simple structure:


      {
        "common": [
             {
                "command"   : "undo_command",
                "args"      : [ true, "test"],
                "key"       : "Ctrl+z"
             },
             {
                "command" : "redo_command",
                "key"     : "Ctrl+Shift+z"
             },
             ...
        ],
        "osx" : [
             {
                "command"   : "undo_command",
                "args"      : [ true, "test"],
                "key"       : "Cmd+z"
             },
             ...
        ]
      }

 *  The configuration contains list of shortcuts. Every shortcut is bound to a key combination it is triggered.
 *  Every shortcut has a name and an optional list of arguments that have to be passed to a shortcut listener method.
 *  The optional arguments can be used to differentiate two shortcuts that are bound to the same command.
 *
 *  On the component level shortcut commands can be listened by implementing method whose name equals to shortcut name.
 *  Pay attention to catch shortcut command your component has to be focusable and holds focus at the given time.
 *  For instance, to catch "undo_command"  do the following:

        var pan = new zebkit.ui.Panel([
            function redo_command() {
                // handle shortcut here
            },

            // visualize the component gets focus
            function focused() {
                this.$super();
                this.setBackground(this.hasFocus()?"red":null);
            }
        ]);

        // let our panel to hold focus by setting appropriate property
        pan.canHaveFocus = true;


 *  @constructor
 *  @class zebkit.ui.ShortcutManager
 *  @extends {zebkit.ui.Manager}
 */

/**
 * Shortcut event is handled by registering a method handler with events manager. The manager is accessed as
 * "zebkit.ui.events" static variable:

        zebkit.ui.events.bind(function commandFired(c) {
            ...
        });

 * @event shortcut
 * @param {Object} c shortcut command
 *         @param {Array} c.args shortcut arguments list
 *         @param {String} c.command shortcut name
 */
import { SHORTCUT_EVENT } from './events';
import Manager from './Manager';
import { environment } from '../../';
import events from '../../';
import focusManager from '../';
import KeyEvent from '../web/keys/KeyEvent';

export default class ShortcutManager extends Manager {
    keyCommands: {};

    constructor(commands){
        super();
        this.keyCommands = {};
        if (commands != null) {
            events._.addEvents("commandFired");
            this.setCommands(commands.common);
            if (environment.isMacOS === true && commands.osx != null) {
                this.setCommands(commands.osx);
            }
        }        
    }
    /**
     * Key pressed event handler.
     * @param  {zebkit.ui.KeyEvent} e a key event
     * @method keyPressed
     */
    keyPressed(e) {
        var fo = focusManager.focusOwner;
        if (fo != null && this.keyCommands[e.code]) {
            var c = this.keyCommands[e.code];
            if (c && c[e.mask] != null) {
                c = c[e.mask];

                SHORTCUT_EVENT.source  = fo;
                SHORTCUT_EVENT.command = c;
                events.fireEvent( "commandFired", SHORTCUT_EVENT);

                if (fo[c.command] != null) {
                    if (c.args && c.args.length > 0) {
                        fo[c.command].apply(fo, c.args);
                    } else {
                        fo[c.command]();
                    }
                }
            }
        }
    }

    $parseKey(k) {
        var m = 0, c = 0, r = k.split("+");
        for(var i = 0; i < r.length; i++) {
            var ch = r[i].trim().toUpperCase();
            if (KeyEvent.hasOwnProperty("M_" + ch)) {
                m += KeyEvent["M_" + ch];
            } else {
                if (KeyEvent.hasOwnProperty(ch)) {
                    c = KeyEvent[ch];
                } else {
                    c = parseInt(ch);
                    if (c == NaN) {
                        throw new Error("Invalid key code : " + ch);
                    }
                }
            }
        }
        return [m, c];
    }

    setCommands(commands) {
        for(var i=0; i < commands.length; i++) {
            var c = commands[i],
                p = this.$parseKey(c.key),
                v = this.keyCommands[p[1]];

            if (v && v[p[0]]) {
                throw new Error("Duplicated command: '" + c.command +  "' (" + p +")");
            }

            if (v == null) {
                v = [];
            }

            v[p[0]] = c;
            this.keyCommands[p[1]] = v;
        }
    }
}