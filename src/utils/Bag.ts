/**
 * JSON configuration objects loader class. The class is
 * handy way to keep and load configuration encoded in JSON
 * format. Except standard JSON types the class uses number
 * of JSON values and key interpretations such as:

    - **"@key_of_refernced_value"** String values that start from "@" character are considered
      as a reference to other values
    - **{ "$class_name":[ arg1, arg2, ...], "prop1": ...}** Key names that starts from "$" character
      are considered as name of class that has to be instantiated as the value
    - **{"?isToucable": { "label": true } }** Key names that start from "?" are considered as
      conditional section.

 * Also the class support section inheritance. That means
 * you can say to include part of JSON to another part of JSON.
 * For instance, imagine JSON describes properties for number
 * of UI components where an UI component can inherits another
 * one.

        {
           // base component
           "BaseComponent": {
               "background": "red",
               "border": "plain",
               "size": [300, 300]
           },

            // component that inherits properties from BaseComponent,
            // but override background property with own value
           "ExtenderComp": {
               "inherit": [ "BaseComponent" ],
               "background": "green"
           }
        }

 *
 * The loading of JSON can be multi steps procedure where
 * you can load few JSON. That means you can compose the
 * final configuration from number of JSON files:

        // prepare object that will keep loaded data
        var loadedData = {};

        // create bag
        var bag = zebkit.util.Bag(loadedData);

        // load the bag with two JSON
        bag.load("{ ... }", false).load("{  ...  }");


 * @class zebkit.util.Bag
 * @constructor
 * @param {Object} [obj] a root object to be loaded with
 * the given JSON configuration
 */
import { types } from '../utils';
import URL from '../utils/URL';
import Runner from '../io/Runner';
import { GET } from '../io/Http';

export default class Bag {
    usePropertySetters: boolean;
    ignoreNonExistentKeys: boolean;
    globalPropertyLookup: boolean;
    variables: any;
    classAliases: any;
    content: any;
    url: string;

    constructor(protected root : any) {
        /**
         * Environment variables that can be referred from loaded content
         * @attribute variables
         * @type {Object}
         */
        this.variables = {};

        /**
         * Object that keeps loaded and resolved content
         * @readonly
         * @attribute root
         * @type {Object}
         * @default {}
         */
        this.root = (root != null ? root : null);

        /**
         * Map of classes
         * @attribute classAliases
         * @protected
         * @type {Object}
         * @default {}
         */
        this.classAliases = {};
        /**
         * The property says if the object introspection is required to try find a setter
         * method for the given key. For instance if an object is loaded with the
         * following JSON:

         {
            "color": "red"
         }

         * the introspection will cause bag class to try finding "setColor(c)" method in
         * the loaded with the JSON object and call it to set "red" property value.
         * @attribute usePropertySetters
         * @default true
         * @type {Boolean}
         */
        this.usePropertySetters = true;

        this.ignoreNonExistentKeys = false;

        this.globalPropertyLookup = false;
    }

    /**
     * Get a property value. The property name can point to embedded fields:
     *
     *      var bag = new Bag().load("my.json");
     *      bag.get("a.b.c");
     *
     * Also the special property type is considered - factory. Access to such property
     * causes a new instance of a class object will be created. Property is considered
     * as a factory property if it declares a "$new" field. The filed should point to
     * a method that will be called to instantiate the property value.
     *
     * @param  {String} key a property key.
     * @return {Object} a property value
     * @throws Error if property cannot be found and "ignoreNonExistentKeys" is true
     * @method  get
     */
    get(key) {
        if (key == null) {
            throw new Error("Null key");
        }

        var v = this.$get(key.split('.'), this.root);
        if (this.ignoreNonExistentKeys !== true && v === undefined) {
            throw new Error("Property '" + key + "' not found");
        }

        return v;
    }

    protected $get(keys, root) {
        var v = root;
        for(var i = 0; i < keys.length; i++) {
            v = v[keys[i]];
            if (typeof v === "undefined") {
                return undefined;
            }
        }
        return v != null && v.$new ? v.$new() : v;
    };

    protected $isAtomic(v) {
        return types.isString(v) || types.isNumber(v) || types.isBoolean(v);
    }

    callMethod(name, args) {
        var vs  = [ this, this.root],
            m   = null,
            ctx = null;

        // lookup method
        for(var i = 0; i < vs.length; i++) {
            if (vs[i] != null && vs[i][name] != null && typeof vs[i][name] == 'function') {
                ctx = vs[i];
                m   = vs[i][name];
                break;
            }
        }

        if (m == null || typeof m != 'function') {
            throw new Error("Method '" + name + "' cannot be found");
        }

        return m.apply(ctx, Array.isArray(args) ? args : [ args ]);
    }

    buildValue(d) {
        if (d == null || types.isNumber(d) || types.isBoolean(d)) {
            return d;
        }

        if (Array.isArray(d)) {
            for(var i = 0; i < d.length; i++) d[i] = this.buildValue(d[i]);
            return d;
        }

        if (types.isString(d)) {
            if (d[0] === '@') {
                if (d[1] === "(" && d[d.length-1] === ")") {
                    // if the referenced path is not absolute path and the bag has been also
                    // loaded by an URL than build the full URL as a relative path from
                    // BAG URL
                    var path = d.substring(2, d.length-1).trim();
                    if (this.url != null && URL.isAbsolute(path) === false) {
                        var pURL = new URL(this.url).getParentURL();
                        if (pURL != null) {
                            path = pURL.join(path);
                        }
                    }
                    return this.buildValue(JSON.parse(GET(path)));
                }
                return this.resolveVar(d.substring(1).trim());
            }
            return d;
        }

        // save inheritance
        var inc = d.inherit;
        if (inc != null) {
            delete d.inherit;
        }

        // test whether we have a class definition
        for (var k in d) {
            // handle class definition
            if (k[0] === '$' && d.hasOwnProperty(k) === true) {
                var classname = k.substring(1).trim(),
                    args      = d[k],
                    clz       = null;

                delete d[k]; // delete class name

                // '?' means optinal class instance.
                if (classname[0] === "?") {
                    classname = classname.substring(1).trim();
                    try {
                        clz = this.resolveClass(classname[0] === '*' ? classname.substring(1).trim() : classname);
                    }
                    catch (e) {
                        return null;
                    }
                }
                else {
                    clz = this.resolveClass(classname[0] === '*' ? classname.substring(1).trim() : classname);
                }

                args = this.buildValue(Array.isArray(args) ? args : [ args ]);
                if (classname[0] === "*") {
                    return (function(clazz, args) {
                        return {
                            $new : function() {
                                return types.newInstance(clazz, args);
                            }
                        };
                    })(clz, args);
                }

                // apply properties to instantiated class
                var classInstance = types.newInstance(clz, args);
                this.populate(classInstance, d);
                return classInstance;
            }

            //!!!!  trust the name of class occurs first what in general
            //      cannot be guaranteed by JSON spec but we can trust
            //      since many other third party applications stands
            //      on it too :)
            break;
        }

        if (inc != null) {
            this.inherit(d, inc);
        }

        for (var k in d) {
            if (d.hasOwnProperty(k)) {
                var v = d[k];

                // special field name that says to call method to create a
                // value by the given description
                if (k[0] === ".") {
                    var mres = this.callMethod(k.substring(1).trim(), this.buildValue(v));
                    delete d[k];
                    if (typeof mres !== 'undefined') {
                        return mres;
                    }
                }
                else {
                    if (k[0] === "?") {
                        k = k.substring(1).trim();
                        if (typeof d[k] !== "undefined") {
                            d[k] = this.buildValue(d[k]);
                        }
                    }
                    else {
                        d[k] = this.buildValue(d[k]);
                    }
                }
            }
        }

        return d;
    }

    populate(obj, desc) {
        var inc = desc.inherit;
        if (inc != null) {
            delete desc.inherit;
        }

        if (inc != null) {
            this.inherit(obj, inc);
        }

        for(var k in desc) {
            if (desc.hasOwnProperty(k) === true) {
                var v = desc[k];

                if (k[0] === '.') {
                    this.callMethod(k.substring(1).trim(), this.buildValue(v));
                    continue;
                }

                if (k[0] === '?') {
                    k = k.substring(1).trim();
                    if (typeof obj[k] === "undefined") {
                        continue;
                    }
                }

                if (this.usePropertySetters === true) {
                    var m = zebkit.getPropertySetter(obj, k);
                    if (m != null) {
                        if (Array.isArray(v)) m.apply(obj, this.buildValue(v));
                        else                  m.call (obj, this.buildValue(v));
                        continue;
                    }
                }

                // if target object doesn't have a property defined or
                // the destination value is atomic or array than
                // set it directly
                var ov = obj[k];
                if (ov == null || this.$isAtomic(ov) || Array.isArray(ov) ||
                    v == null  || this.$isAtomic(v)  || Array.isArray(v)  ||
                    this.$isClassDefinition(k, v)                            )
                {

                    obj[k] = this.buildValue(v);
                }
                else {
                    obj[k] = this.populate(obj[k], v);
                }
            }
        }
        return obj;
    }

    protected $isClassDefinition(kk, v) {
        if (v != null && v.constructor === Object) {
            for(var k in v) {
                if (k[0] === '$') {
                    return true;
                }
                break;
            }
        }
        return false;
    }

    /**
     * Called every time the given class name has to be transformed into
     * the class object (constructor) reference.
     * @param  {String} className a class name
     * @return {Function}   a class reference
     * @method resolveClass
     */
    resolveClass(className) {
        return this.classAliases.hasOwnProperty(className) ? this.classAliases[className]
                                                            : zebkit.Class.forName(className);
    }

    addClassAliases(aliases) {
        for(var k in aliases) {
            this.classAliases[k] = Class.forName(aliases[k].trim());
        }
    }

    addVariables(variables) {
        for(var k in variables) {
            this.variables[k] = variables[k];
        }
    }

    inherit(o, inc) {
        if (Array.isArray(inc) === false) inc = [ inc ];
        for (var i = 0; i < inc.length; i++) {
            var v = this.resolveVar(inc[i]);

            if (typeof v === 'undefined') {
                throw new Error("Reference '" + inc[i] + "' not found");
            }

            if (v == null || this.$isAtomic(v) || Array.isArray(v)) {
                throw new Error("Invalid type of inheritance '" + inc[i] + "'");
            }

            for(var kk in v) {
                if (kk[0] !== '$' && v.hasOwnProperty(kk) === true && typeof v[kk] !== "function") {
                    o[kk] = v[kk];
                }
            }
        }
    }

    /**
     * Load the given JSON content and parse if the given flag is true. The passed
     * boolean flag controls parsing. The flag is used to load few JSON. Before
     * parsing the JSONs are merged and than the final result is parsed.
     * @param  {String|Object} s a JSON content to be loaded. It can be a JSON as string or
     * URL to JSON or JSON object
     * @param {Function} [cb] callback function if the JSOn content has to be loaded asynchronously
     * @chainable
     * @return {zebkit.util.Bag} a reference to the bag class instance
     * @method load
     */
    load(s, cb) {
        var runner = new Runner(),
            $this  = this;

        runner.run(function() {
            if (zebkit.isString(s)) {
                s = s.trim();

                // detect if the passed string is not a JSON, but URL
                if ((s[0] !== '[' || s[s.length - 1] !== ']') &&
                    (s[0] !== '{' || s[s.length - 1] !== '}')   )
                {
                    var p = s.toString();
                    p = p + (p.lastIndexOf("?") > 0 ? "&" : "?") + (new Date()).getTime().toString();

                    $this.url = s.toString();

                    if (cb == null) {
                        return GET(p);
                    }

                    var join = this.join();
                    GET(p, function(r) {
                        if (r.status != 200) {
                            runner.fireError(new Error("Invalid JSON path"));
                        }
                        else {
                            join.call($this, r.responseText);
                        }
                    });

                    return;
                }
            }
            return s;
        })
        . // parse JSON if necessary
        run(function(s) {
            if (types.isString(s)) {
                try {
                    return JSON.parse(s);
                }
                catch(e) {
                    throw new Error("JSON format error: " + e);
                }
            }
            return s;
        })
        . // populate JSON content
        run(function(content) {
            $this.content = content;
            $this.root = ($this.root == null ? $this.buildValue(content)
                                                : $this.populate($this.root, content));
            if (cb != null) cb.call($this);
        })
        .
        error(function(e) {
            if (cb != null) cb.call($this, e);
            throw e;
        });

        return this;
    };

    this.resolveVar = function(name) {
        if (this.variables.hasOwnProperty(name)) {
            return this.variables[name];
        }

        var k = name.split("."), v;

        if (this.root != null) {
            v = this.$get(k, this.root);
        }

        if (typeof v === 'undefined') {
            v = this.$get(k, this.content);
        }

        if (typeof v === 'undefined' && this.globalPropertyLookup === true) {
            v = this.$get(k, zebkit.$global);
        }

        if (typeof v === 'undefined') {
            throw new Error("Invalid reference '" +  name + "'");
        }

        return v;
    };

    this.expr = function(e) {
        eval("var r="+e);
        return r;
    };
}
