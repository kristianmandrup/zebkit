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

/**
 * Instantiate a new class instance by the given class name with the specified constructor
 * arguments.
 * @param  {Function} clazz a class
 * @param  {Array} [args] an arguments list
 * @return {Object}  a new instance of the given class initialized with the specified arguments
 * @api  zebkit.util.newInstance()
 * @method newInstance
 */
export const newInstance = function(clazz, args) {
    if (args && args.length > 0) {
        function f() {}
        f.prototype = clazz.prototype;
        var o = new f();
        clazz.apply(o, args);
        return o;
    }
    return new clazz();
};


export const $busy    = 1,
    $cachedO =  {},
    $cachedE = [],
    $cacheSize = 7777,
    $readyCallbacks = []; // stores method that wait for redness


import { $global } from './environment';

/**
 * Get an object by the given key from cache (and cached it if necessary)
 * @param  {String} key a key to an object. The key is hierarchical reference starting with the global
 * name space as root. For instance "test.a" key will fetch $global.test.a object.
 * @return {Object}  an object
 * @api  zebkit.$cache
 */
export const $cache = function(key) {
    // don't cache global objects
    if ($global[key]) {
        return $global[key];
    }

    if ($cachedO.hasOwnProperty(key) === true) {
        // read cached entry
        var e = $cachedO[key];
        if (e.i < ($cachedE.length-1)) { // cached entry is not last one

            // move accessed entry to the list tail to increase its access weight
            var pn = $cachedE[e.i + 1];
            $cachedE[e.i]   = pn;
            $cachedE[++e.i] = key;
            $cachedO[pn].i--;
        }
        return e.o;
    }

    var ctx = $global, i = 0, j = 0;
    for( ;ctx != null; ) {
        i = key.indexOf('.', j);

        if (i < 0) {
            ctx = ctx[key.substring(j, key.length)];
            break;
        }

        ctx = ctx[key.substring(j, i)];
        j = i + 1;
    }

    if (ctx != null) {
        if ($cachedE.length >= $cacheSize) {
            // cache is full, replace first element with the new one
            var n = $cachedE[0];
            $cachedE[0]   = key;
            $cachedO[key] = { o:ctx, i:0 };
            delete $cachedO[n];
        }
        else {
            $cachedO[key] = { o: ctx, i:$cachedE.length };
            $cachedE[$cachedE.length] = key;
        }
        return ctx;
    }

    throw new Error("Reference '" + key + "' not found");
};

export class Class {
    /**
     * Get class by the given class name
     * @param  {String} name a class name
     * @return {Function} a class. Throws exception if the class cannot be
     * resolved by the given class name
     * @method forName
     * @throws Error
     * @api  zebkit.forName()
     */
    static forName = function(name) {
        return $cache(name);
    };

    static newInstance = function() {
        return newInstance(this, arguments);
    };
} 

