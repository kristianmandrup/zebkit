/**
 * The module provides number of classes to help to communicate
 * with remote services and servers by HTTP, JSON-RPC, XML-RPC
 * protocols
 * @module io
 * @requires zebkit
 */

var HEX = "0123456789ABCDEF";

/**
 * Generate UUID of the given length
 * @param {Integer} [size] the generated UUID length. The default size is 16 characters.
 * @return {String} an UUID
 * @method  ID
 * @api  zebkit.io.ID()
 */
 
function UUID(size) {
    if (size == null) size = 16;
    var id = "";
    for (var i=0; i < size; i++) id = id + HEX[~~(Math.random() * 16)];
    return id;
};

export const ID = UUID;

export function $sleep() {
    var r = new XMLHttpRequest(),
        t = (new Date()).getTime().toString(),
        i = window.location.toString().lastIndexOf("?");
    r.open('GET', window.location + (i > 0 ? "&" : "?") + t, false);
    r.send(null);
};

import * as b64 from './b64';
export const b64;

import * as date from './date';
export const date;

import * as extras from './extras';
export const extras;

import * as http from './Http';
export const http;

import * as output from './output';
export const output;

import * as stream from './stream';
export const stream;

import * as service from './service';
export const service;

export { default as Request } from './Request';
export { default as Runner } from './Runner';
