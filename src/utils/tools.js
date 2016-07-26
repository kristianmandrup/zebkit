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
