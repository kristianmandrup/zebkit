/**
 * The class is implementation of JSON-RPC remote service connector.

        // create JSON-RPC connector to a remote service that
        // has three remote methods
        var service = new zebkit.io.JRPC("json-rpc.com", [
            "method1", "method2", "method3"
        ]);

        // synchronously call remote method "method1"
        service.method1();

        // asynchronously call remote method "method1"
        service.method1(function(res) {
            ...
        });

 * @class zebkit.io.JRPC
 * @constructor
 * @param {String} url an URL of remote service
 * @param {Array} methods a list of methods names the remote service provides
 * @extends {zebkit.io.Service}
 */
import Service from './Service';
import { ID } from '../';

export default class JsonRPC extends Service {
    version: string;
    contentType: string;

    /**
     * Shortcut to call the specified method of a JSON-RPC service.
     * @param  {String} url an URL
     * @param  {String} method a method name
     * @api zebkit.io.JRPC.invoke()
     * @method invoke
     */
    static invoke = function(url, method) {
        return Service.invoke(JsonRPC, url, method);
    };    

    constructor(url, methods) {
        super(url, methods);
        this.version = "2.0";
        this.contentType = "application/json; charset=ISO-8859-1;";
    }

    encode(name, args) {
        return JSON.stringify({ jsonrpc: this.version, method: name, params: args, id: ID() });
    }

    decode(r) {
        if (r === null || r.length === 0) {
            throw new Error("Empty JSON result string");
        }

        r = JSON.parse(r);
        if (typeof(r.error) !== "undefined") {
            throw new Error(r.error.message);
        }

        if (typeof r.result === "undefined" || typeof r.id === "undefined") {
            throw new Error("Wrong JSON response format");
        }
        return r.result;
    }
}

