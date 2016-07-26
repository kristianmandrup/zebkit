export default class AssertionError extends Error {
    err: any;

    constructor(msg) {
        super();
        Error.call(this, msg);
        this.err = new Error();
        this.message = msg;
    }

    assert(c, bool, lab, type) {
        this.err.assert(c, bool, lab, type);
    }

    assertTrue(c, lab) {
        this.assert(c, true, lab, "AssertTrue");
    }    

    assertFalse(c, lab) {
        this.assert(c, false, lab, "AssertFalse");
    }

    assertNull(c, lab) {
        this.assertIt(c, null, lab,  "AssertNull");
    }

    assertDefined(o, p, lab) {
        this.assertIt(typeof o[p] !== "undefined", true, lab,  "AssertDefined");
    }

    assertFDefined(o, f, lab) {
        var b = typeof o[f] !== "undefined" && typeof o[f] === "function";
        if (!b && zebkit.isIE) b = !!o[f] && typeof o[f].toString==="undefined" && /^\s*\bfunction\b/.test(o[f]);
        this.assertIt(b, true, lab, "AssertFunctionDefined");
    }

    assertObjEqual(obj1, obj2, lab) {
        function cmp(obj1, obj2, path) {
            function isNumeric(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            }

            if (obj1 === obj2) return true;

            if (obj1 == null || obj2 == null) {
                throw new AssertionError("One of the compared object is null");
            }

            if (Array.isArray(obj1)) {
                if (!Array.isArray(obj2) || obj1.length != obj2.length) {
                    throw new AssertionError("Array type or length mismatch");
                }

                for(var i=0; i < obj1.length; i++) {
                    if (!cmp(obj1[i], obj2[i], path)) return false;
                }
                return true;
            }

            if (zebkit.isString(obj1) || isNumeric(obj1) || typeof obj1 === 'boolean') {
                if (obj1 !== obj2) throw new AssertionError("Objects values '" + obj1 + "' !== '" + obj2 );
                return true;
            }

            for(var k in obj1) {
                var pp =  path == "" ? k : path + "." + k;

                if (typeof obj2[k] === "undefined") {
                    throw new AssertionError("Object field '"  + pp + "' is undefined" );
                }
                if (!cmp(obj1[k], obj2[k], pp)) return false;
            }
            return true;
        }

        this.assertIt(cmp(obj1, obj2, "") && cmp(obj2, obj1, ""), true, lab, "AssertObjectEqual");
    };

    assertIt(c, er, lab, assertLab) {
        if (typeof assertLab === "undefined") {
            assertLab = "Assert";
        }
        if (c !== er) {
            throw new AssertionError((lab ? "'" + lab + "' ":"") + assertLab + " result = '" + c  + "' expected = '" + er + "'");
        }
    }

    assertException(f, et, lab) {
        if (!(f instanceof Function)) throw new WrongArgument("Function as input is expected");

        if (zebkit.isString(et)) lab = et;
        if (arguments.length < 2 || zebkit.isString(et)) et = Error;

        try { f(); }
        catch(e) {
            if (e instanceof et) return;
            throw e;
        }
        throw new AssertionError((lab ? "'" + lab + "'":"") + " in\n" + f + "\n" + "method. '" + et.name + "' exception is expected");
    }

    assertNoException(f, lab) {
        if (!(f instanceof Function)) throw new WrongArgument("Function as input is expected");
        try { f(); }
        catch(e) {
            throw new AssertionError((lab ? "'" + lab + "'":"") + " in\n" + f + "\n" + "method. '" + e.toString() + "' exception is not expected");
        }
    }    
}
