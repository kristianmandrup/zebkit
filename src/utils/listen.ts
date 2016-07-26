/**
 * This this META class is handy container to keep different types of listeners and
 * fire events to the listeners:

        // create listener container to keep three different events
        // handlers
        var MyListenerContainerClass = zebkit.util.ListenersClass("event1",
                                                                  "event2",
                                                                  "event3");

        // instantiate listener class container
        var listeners = new MyListenerContainerClass();

        // add "event1" listener
        listeners.add(function event1() {
            ...
        });

        // add "event2" listener
        listeners.add(function event2() {
           ...
        });

        // and firing event1 to registered handlers
        listeners.event1(...);

        // and firing event2 to registered handlers
        listeners.event2(...);

 * @class zebkit.util.Listeners
 * @constructor
 * @param {String} [events]* events types the container has to support
 */
var $NewListener = function() {
    var args = Array.prototype.slice.call(arguments);
    if (args.length === 0) {
       args = ["fired"];
    }

    var clazz = function() {};
    clazz.eventNames = args;
    clazz.ListenersClass = function() {
        var args = this.eventNames.slice(); // clone
        for(var i = 0; i < arguments.length; i++) args.push(arguments[i]);
        return $NewListener.apply(this, args);
    };

    if (args.length === 1) {
        var name = args[0];

        clazz.prototype.add = function() {
            if (this.v == null) this.v = [];

            var ctx = this,
                l   = arguments[arguments.length - 1]; // last arguments are handler(s)

            if (typeof l !== 'function') {
                ctx = l;
                l   = l[name];

                if (l == null || typeof l !== "function") {
                    return null;
                }
            }

            if (arguments.length > 1 && arguments[0] != name) {
                throw new Error("Unknown event type :" + name);
            }

            this.v.push(ctx, l);
            return l;
        };

        clazz.prototype.remove = function(l) {
            if (this.v != null) {
                if (arguments.length === 0) {
                    // remove all
                    this.v.length = 0;
                }
                else {
                    var i = 0;
                    while((i = this.v.indexOf(l)) >= 0) {
                        if (i % 2 > 0) i--;
                        this.v.splice(i, 2);
                    }
                }
            }
        };

        clazz.prototype[name] = function() {
            if (this.v != null) {
                for(var i = 0;i < this.v.length; i+=2) {
                    if (this.v[i + 1].apply(this.v[i], arguments) === true) {
                        return true;
                    }
                }
            }
            return false;
        };
    }
    else {
        var names = {};
        for(var i=0; i< args.length; i++) {
            names[args[i]] = true;
        }

        clazz.prototype.add = function(l) {
            if (this.methods == null) this.methods = {};

            var n = null;
            if (arguments.length > 1) {
                n = arguments[0];
                l = arguments[arguments.length - 1]; // last arguments are handler(s)
            }

            if (typeof l === 'function') {
                if (n == null) n = zebkit.$FN(l);
                if (n !== '' && names.hasOwnProperty(n) === false) {
                    throw new Error("Unknown event type " + n);
                }

                if (this.methods[n] == null) this.methods[n] = [];
                this.methods[n].push(this, l);
            }
            else {
                var b = false;
                for(var k in names) {
                    if (typeof l[k] === "function") {
                        b = true;
                        if (this.methods[k] == null) this.methods[k] = [];
                        this.methods[k].push(l, l[k]);
                    }
                }

                if (b === false) {
                    return null;
                }
            }
            return l;
        };

        clazz.prototype.addEvents = function() {
            for(var i = 0; i < arguments.length; i++) {
                var name = arguments[i];

                if (name == null || this[name] != null) {
                    throw new Error("" + name + " (event name)");
                }

                this[name] = (function(name) {
                    return function() {
                        if (this.methods != null) {
                            var c = this.methods[name];
                            if (c != null) {
                                for(var i = 0; i < c.length; i+=2) {
                                    if (c[i+1].apply(c[i], arguments) === true) {
                                        return true;
                                    }
                                }
                            }

                            c = this.methods[''];
                            if (c != null) {
                                for(var i = 0; i < c.length; i+=2) {
                                    if (c[i+1].apply(c[i], arguments) === true) {
                                        return true;
                                    }
                                }
                            }
                        }
                        return false;
                    };
                })(name);
            }
        };

        // populate methods that has to be called to send appropriate events to
        // registered listeners
        clazz.prototype.addEvents.apply(clazz.prototype, args);

        clazz.prototype.remove = function(l) {
            if (this.methods != null) {
                if (arguments.length === 0) {
                    for(var k in this.methods) {
                        if (this.methods.hasOwnProperty(k)) this.methods[k].length = 0;
                    }
                    this.methods = {};
                }
                else {
                    for (var k in this.methods) {
                        var v = this.methods[k], i = 0;
                        while ((i = v.indexOf(l)) >= 0) {
                            if (i%2 > 0) i--;
                            v.splice(i, 2);
                        }

                        if (v.length === 0) {
                            delete this.methods[k];
                        }
                    }
                }
            }
        };
    }

    return clazz;
};

export const Listeners = $NewListener();
export const ListenersClass = $NewListener;
