export const format = function(s, obj, ph) {
    if (arguments.length < 3) ph = '';

    var rg = /\$\{([0-9]+\s*,)?(.?,)?([a-zA-Z_][a-zA-Z0-9_]*)\}/g,
        r  = [],
        i  = 0,
        j  = 0,
        m  = null;

    while ((m = rg.exec(s)) !== null) {
        r[i++] = s.substring(j, m.index);

        j = m.index + m[0].length;

        var v  = obj[m[3]],
            mn = "get" + m[3][0].toUpperCase() + m[3].substring(1),
            f  = obj[mn];

        if (typeof f === "function") {
            v = f.call(obj);
        }

        if (m[1] != null) {
            var ml  = parseInt(m[1].substring(0, m[1].length - 1).trim()),
                ph2 = m[2] != null ? m[2].substring(0, m[2].length - 1) : ph;

            if (v == null) {
                ph2 = ph;
                v = "";
            }
            else {
                v = "" + v;
            }
            for(var k = v.length; k < ml; k++) v = ph2 + v;
        }

        if (v == null) v = ph;

        r[i++] = v;
    }

    if (i > 0) {
        if (j < s.length) r[i++] = s.substring(j);
        return pkg.format(r.join(''), obj, ph);
    }
    return s;
};