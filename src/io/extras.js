var CDNAME = '';

export const getMethod = function(clazz, name) {
    // map user defined constructor to internal constructor name
    if (name == CDNAME) name = zebkit.CNAME;
    var m = clazz.prototype[name];
    return (typeof m === 'function') ?  m : null;
};

var isBA = typeof(ArrayBuffer) !== 'undefined';


