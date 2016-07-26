//  Faster match operation analogues:
//  Math.floor(f)  =>  ~~(a)
//  Math.round(f)  =>  (f + 0.5) | 0
export function isString(o)  {
    return typeof o !== "undefined" && o !== null &&
          (typeof o === "string" || o.constructor === String);
}

export function isNumber(o)  {
    return typeof o !== "undefined" && o !== null &&
          (typeof o === "number" || o.constructor === Number);
}

export function isBoolean(o) {
    return typeof o !== "undefined" && o !== null &&
          (typeof o === "boolean" || o.constructor === Boolean);
}

export const instanceOf = function(obj, clazz) {
    if (clazz != null) {
        if (obj == null || typeof obj.clazz === 'undefined') {
            return false;
        }

        var c = obj.clazz;
        return c != null && (c === clazz || typeof c.$parents[clazz.$hash$] !== "undefined");
    }

    throw new Error("instanceOf(): null class");
};
