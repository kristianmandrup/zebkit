/**
 * The class is implementation of XML-RPC remote service connector.

        // create XML-RPC connector to a remote service that
        // has three remote methods
        var service = new zebkit.io.XRPC("xmlrpc.com", [
            "method1", "method2", "method3"
        ]);

        // synchronously call remote method "method1"
        service.method1();

        // asynchronously call remote method "method1"
        service.method1(function(res) {
            ...
        });

 * @class zebkit.io.XRPC
 * @constructor
 * @extends {zebkit.io.Service}
 * @param {String} url an URL of remote service
 * @param {Array} methods a list of methods names the remote service provides
 */
import Service from './Service';
import { types } from '../../utils';
import { date, b64, xml } from '../';

export default class XRPC extends Service {
    contentType: string;

    constructor(url, methods) {
        super(url, methods);
        this.contentType = "text/xml";
    }

    encode(name, args) {
        var p = ["<?xml version=\"1.0\"?>\n<methodCall><methodName>", name, "</methodName><params>"];
        for(var i=0; i < args.length;i++) {
            p.push("<param>");
            this.encodeValue(args[i], p);
            p.push("</param>");
        }
        p.push("</params></methodCall>");
        return p.join('');
    }

    encodeValue(v, p)  {
        if (v === null) {
            throw new Error("Null is not allowed");
        }

        if (types.isString(v)) {
            v = v.replace("<", "&lt;");
            v = v.replace("&", "&amp;");
            p.push("<string>", v, "</string>");
        }
        else {
            if (types.isNumber(v)) {
                if (Math.round(v) == v) p.push("<i4>", v.toString(), "</i4>");
                else                    p.push("<double>", v.toString(), "</double>");
            }
            else {
                if (types.isBoolean(v)) p.push("<boolean>", v?"1":"0", "</boolean>");
                else {
                    if (v instanceof Date)  p.push("<dateTime.iso8601>", date.dateToISO8601(v), "</dateTime.iso8601>");
                    else {
                        if (Array.isArray(v))  {
                            p.push("<array><data>");
                            for(var i=0;i<v.length;i++) {
                                p.push("<value>");
                                this.encodeValue(v[i], p);
                                p.push("</value>");
                            }
                            p.push("</data></array>");
                        }
                        else {
                            if (v instanceof b64.Base64) p.push("<base64>", v.toString(), "</base64>");
                            else {
                                p.push("<struct>");
                                for(var k in v) {
                                    if (v.hasOwnProperty(k)) {
                                        p.push("<member><name>", k, "</name><value>");
                                        this.encodeValue(v[k], p);
                                        p.push("</value></member>");
                                    }
                                }
                                p.push("</struct>");
                            }
                        }
                    }
                }
            }
        }
    }

    decodeValue(node) {
        var tag = node.tagName.toLowerCase();
        if (tag == "struct")
        {
                var p = {};
                for(var i=0; i < node.childNodes.length; i++) {
                var member = node.childNodes[i],  // <member>
                    key    = member.childNodes[0].childNodes[0].nodeValue.trim(); // <name>/text()
                p[key] = this.decodeValue(member.childNodes[1].childNodes[0]);   // <value>/<xxx>
            }
            return p;
        }
        if (tag == "array") {
            var a = [];
            node = node.childNodes[0]; // <data>
            for(var i=0; i < node.childNodes.length; i++) {
                a[i] = this.decodeValue(node.childNodes[i].childNodes[0]); // <value>
            }
            return a;
        }

        var v = node.childNodes[0].nodeValue.trim();
        switch (tag) {
            case "datetime.iso8601": return date.ISO8601toDate(v);
            case "boolean": return v == "1";
            case "int":
            case "i4":     return parseInt(v, 10);
            case "double": return Number(v);
            case "base64":
                var b64 = new b64.Base64();
                b64.encoded = v;
                return b64;
            case "string": return v;
        }
        throw new Error("Unknown tag " + tag);
    }

    decode(r) {
        var p = xml.parseXML(r),
            c = p.getElementsByTagName("fault");

        if (c.length > 0) {
            var err = this.decodeValue(c[0].getElementsByTagName("struct")[0]);
            throw new Error(err.faultString);
        }

        c = p.getElementsByTagName("methodResponse")[0];
        c = c.childNodes[0].childNodes[0]; // <params>/<param>
        if (c.tagName.toLowerCase() === "param") {
            return this.decodeValue(c.childNodes[0].childNodes[0]); // <value>/<xxx>
        }
        throw new Error("incorrect XML-RPC response");
    }

    /**
     * Shortcut to call the specified method of a XML-RPC service.
     * @param  {String} url an URL
     * @param  {String} method a method name
     * @api zebkit.io.XRPC.invoke()
     * @method invoke
     */
    invoke = function(url, method) {
        return Service.invoke(XRPC, url, method);
    };    
}



