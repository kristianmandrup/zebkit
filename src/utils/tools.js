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

export const $component = function(desc, instance) {
    if (types.isString(desc)) {
        //  [x] Text
        //  @(image-path:wxh) Text
        //  Text

        var m = desc.match(/^(\[[x ]?\])/);
        if (m != null) {
            var txt = desc.substring(m[1].length),
                ch  = instance != null && instance.clazz.Checkbox != null ? new instance.clazz.Checkbox(txt)
                                                                          : new pkg.Checkbox(txt);
            ch.setValue(m[1].indexOf('x') > 0);
            return ch;
        } else {
            var m = desc.match(/^@\((.*)\)(\:[0-9]+x[0-9]+)?/);
            if (m != null) {
                var path = m[1],
                    txt  = desc.substring(path.length + 3 + (m[2] != null ? m[2].length : 0)).trim(),
                    img  = instance != null && instance.clazz.ImagePan != null ? new instance.clazz.ImagePan(path)
                                                                               : new pkg.ImagePan(path);

                if (m[2] != null) {
                    var s = m[2].substring(1).split('x'),
                        w = parseInt(s[0], 10),
                        h = parseInt(s[1], 10);

                    img.setPreferredSize(w, h);
                }

                if (txt.length == 0) {
                    return img;
                }

                return instance != null && instance.clazz.ImageLabel != null ? new instance.clazz.ImageLabel(txt, img)
                                                                             : new pkg.ImageLabel(txt, img);
            } else {
                return instance != null && instance.clazz.Label != null ? new instance.clazz.Label(desc)
                                                                        : new pkg.Label(desc);
            }
        }
    } else if (Array.isArray(desc)) {
        if (desc.length > 0 && Array.isArray(desc[0])) {
            var model = new zebkit.data.Matrix(desc.length, desc[0].length);
            for(var row = 0; row < model.rows; row++) {
                for(var col = 0; col < model.cols; col++) {
                    model.put(row, col, desc[row][col]);
                }
            }
            return new pkg.grid.Grid(model);
        } else {
            var clz = instance != null && instance.clazz.Combo != null ? instance.clazz.Combo
                                                                       : pkg.Combo,
                combo = new clz(new clz.CompList(true)),
                selectedIndex = -1;

            for(var i = 0; i < desc.length; i++) {
                var s = desc[i];
                if (zebkit.isString(s)) {
                    if (selectedIndex === -1 && s.length > 1 && s[0] === '*') {
                        selectedIndex = i;
                        desc[i] = s.substring(1);
                    }
                }
                combo.list.add(pkg.$component(desc[i], combo.list));
            }

            combo.select(selectedIndex);
            return combo;
        }
    } else if (desc instanceof Image) {
        return instance != null && instance.clazz.ImagePan != null ? new instance.clazz.ImagePan(desc)
                                                                   : new pkg.ImagePan(desc);
    } else if (zebkit.instanceOf(desc, pkg.View)) {
        var v = instance != null && instance.clazz.ViewPan != null ? new instance.clazz.ViewPan()
                                                                   : new pkg.ViewPan();
        v.setView(desc);
        return v;
    }

    // TODO: desc
    return desc;
};

