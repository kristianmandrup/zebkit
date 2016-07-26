//               protocol[1]        host[2]  path[3]  querystr[4]
var purl = /^([a-zA-Z_0-9]+\:)\/\/([^\/]*)(\/[^?]*)(\?[^?\/]*)?/;

/**
 * URL class
 * @param {String} url an url
 * @constructor
 * @class zebkit.URL
 */
export default function URL(url) {
    var a = document.createElement('a');
    a.href = url;
    var m = purl.exec(a.href);

    if (m == null) {
        m = purl.exec(window.location);
        if (m == null) {
            throw new Error("Cannot resolve '" + url + "' url");
        }
        a.href = m[1] + "//" + m[2] + m[3].substring(0, p.lastIndexOf("/") + 1) + url;
        m = purl.exec(a.href);
    }

    /**
     * URL path
     * @attribute path
     * @type {String}
     * @readOnly
     */
    this.path = m[3].replace(/[\/]+/g, "/");
    this.href = a.href;

    /**
     * URL protocol
     * @attribute protocol
     * @type {String}
     * @readOnly
     */
    this.protocol = (m[1] != null ? m[1].toLowerCase() : null);

    /**
     * Host
     * @attribute host
     * @type {String}
     * @readOnly
     */
    this.host = m[2];

    /**
     * Query string
     * @attribute qs
     * @type {String}
     * @readOnly
     */
    this.qs = m[4];
};

URL.prototype.toString = function() {
    return this.href;
};

/**
 * Get a parent URL of the URL
 * @return  {zebkit.URL} a parent URL
 * @method getParentURL
 */
URL.prototype.getParentURL = function() {
    var i = this.path.lastIndexOf("/");
    return (i < 0) ? null
                    : new pkg.URL(this.protocol + "//" + this.host + this.path.substring(0, i + 1));
};

/**
 * Test if the given url is absolute
 * @param  {u}  u an URL
 * @return {Boolean} true if the URL is absolute
 * @method isAbsolute
 */
URL.prototype.isAbsolute = function(u) {
    return /^[a-zA-Z]+\:\/\//i.test(u);
};

/**
 * Join the given relative path to the URL.
 * If the passed path starts from "/" character
 * it will be joined without taking in account
 * the URL path
 * @param  {String} p a relative path
 * @return {String} an absolute URL
 * @method join
 */
URL.prototype.join = function(p) {
    if (this.isAbsolute(p)) {
        throw new Error("Absolute URL '" + p + "' cannot be joined");
    }

    return p[0] === '/' ? this.protocol + "//" + this.host + p
                        : this.protocol + "//" + this.host + this.path + (this.path[this.path.length-1] === '/' ? '' : '/') + p;
};
