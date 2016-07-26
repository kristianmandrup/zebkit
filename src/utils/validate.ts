/**
 * Number of different utilities methods and classes
 * @module util
 * @requires zebkit
 */

export const $validateValue = function(value, x, x2?, x3?, x4?) {
    if (arguments.length < 2) {
        throw new Error("Invalid arguments list. List of valid values is expected");
    }

    for(var i = 1; i < arguments.length; i++) {
        if (arguments[i] === value) return value;
    }

    var values = Array.prototype.slice.call(arguments).slice(1);
    throw new Error("Invalid value '" + value + "',the following values are expected: " + values.join(','));
};
