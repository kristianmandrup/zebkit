import { types } from '../../utils';

/**
 * Query string parser class. The class provides number of
 * useful static methods to manipulate with a query string
 * of an URL
 * @class zebkit.io.QS
 * @static
 */
export default class QS {
    /**
     * Append the given parameters to a query string of the specified URL
     * @param  {String} url an URL
     * @param  {Object} obj a dictionary of parameters to be appended to
     * the URL query string
     * @return {String} a new URL
     * @static
     * @method append
     */
    append(url, obj) {
        return url + ((obj === null) ? '' : ((url.indexOf("?") > 0) ? '&' : '?') + QS.toQS(obj, true));
    }

    /**
     * Fetch and parse query string of the given URL
     * @param  {String} url an URL
     * @return {Object} a parsed query string as a dictionary of parameters
     * @method parse
     * @static
     */
    parse(url) {
        var m = window.location.search.match(/[?&][a-zA-Z0-9_.]+=[^?&=]+/g), r = {};
        for(var i=0; m && i < m.length; i++) {
            var l = m[i].split('=');
            r[l[0].substring(1)] = decodeURIComponent(l[1]);
        }
        return r;
    }

    /**
     * Convert the given dictionary of parameters to a query string.
     * @param  {Object} obj a dictionary of parameters
     * @param  {Boolean} encode say if the parameters values have to be
     * encoded
     * @return {String} a query string built from parameters list
     * @static
     * @method toQS
     */
    toQS(obj, encode) {
        if (typeof encode === "undefined") encode = true;
        if (types.isString(obj) || types.isBoolean(obj) || types.isNumber(obj)) {
            return "" + obj;
        }

        var p = [];
        for(var k in obj) {
            if (obj.hasOwnProperty(k)) {
                p.push(k + '=' + (encode ? encodeURIComponent(obj[k].toString())
                                            : obj[k].toString()));
            }
        }
        return p.join("&");
    }
}