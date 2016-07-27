import { types } from './';

if (typeof console === "undefined" ) {
    console = {
        log  : function() {
            return print.apply(this, arguments);
        }
    };
}

export const $caller    = null; // currently called method reference

export const assume = function(c, er, lab) {
    if (c !== er) pkg.warn("Wrong assumption " + (lab ? "'" + lab + "'":"") + " evaluated = '" + c  + "' expected = '" + er + "'");
};

export const obj2str = function(v, shift) {
    if (typeof shift === "undefined") shift = "";

    if (v == null || zebkit.isNumber(v) || zebkit.isBoolean(v) || zebkit.isString(v)) {
        return v;
    }

    if (Array.isArray(v)) {
        var s = [  "["  ];
        for(var i=0; i < v.length; i++) {
            if (i > 0) s.push(", ");
            s.push(pkg.obj2str(v[i]));
        }
        s.push("]");
        return s.join("");
    }

    var s = [shift, "{"];
    for(var k in v) {
        if (v.hasOwnProperty(k) && k[0] != '$') {
            s.push("\n  " + shift + k + " = " + pkg.obj2str(v[k], shift + "  "));
        }
    }
    s.push("\n", shift, "}");
    return s.join('');
}

export const $FN = function(f) { return f.name; };

export const $annotate = function (clazz, callback) {
    var methodName = $FN(callback);

    if (typeof clazz.prototype[methodName] !== 'function') {
        throw new Error("Method '" + methodName + "' not found");
    }

    var m = clazz.prototype[methodName];
    if (typeof m.$watched !== 'undefined') {
        throw new Error("Method '" + methodName + "' is already annotated");
    }

    clazz.prototype[methodName] = function() {
        var o = new Object(), t = this, a = Array.prototype.slice.call(arguments);
        o.method = m;
        o.args   = a;
        o.call = function() {
            return m.apply(t, a);
        };
        return callback.call(this, o);
    };

    clazz.prototype[methodName].$watched = m;
}

// target - is object whose properties have to populated
// p      - properties
export const properties = function(target, p) {
    for(var k in p) {
        // skip private properties( properties that start from "$")
        if (k !== "clazz" && k[0] !== '$' && p.hasOwnProperty(k) && typeof p[k] !== "undefined" && typeof p[k] !== 'function') {
            if (k[0] === '-') {
                delete target[k.substring(1)];
            } else {
                var v = p[k],
                    m = zebkit.getPropertySetter(target, k);

                // value factory detected
                if (v !== null && v.$new != null) {
                    v = v.$new();
                }

                if (m === null) {
                    target[k] = v;  // setter doesn't exist, setup it as a field
                } else {
                    // property setter is detected, call setter to
                    // set the property value
                    if (Array.isArray(v)) m.apply(target, v);
                    else                  m.call(target, v);
                }
            }
        }
    }
    return target;
};