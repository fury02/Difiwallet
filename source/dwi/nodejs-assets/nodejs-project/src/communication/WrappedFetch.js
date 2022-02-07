"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const Common_1 = require("../const/Common");
let useICUrl = false;
/* eslint-disable no-param-reassign */
const wrappedFetchInternal = (fetch, resolve, reject, resource, ...initArgs) => {
    if (!resource.includes(Common_1.PLUG_PROXY_HOST)) {
        fetch(resource, ...initArgs)
            .then(resolve)
            .catch(reject);
        return;
    }
    if (useICUrl) {
        resource = new URL(resource);
        resource.host = Common_1.IC_URL_HOST;
    }
    fetch(resource, ...initArgs)
        .then(r => {
        if (!useICUrl && r.status === 502) {
            useICUrl = true;
            wrappedFetchInternal(resolve, reject, resource, initArgs);
            return;
        }
        resolve(r);
    })
        .catch(e => {
        reject(e);
    });
};
exports.wrappedFetch = (fetch = cross_fetch_1.default) => (...args) => {
    let reject;
    let resolve;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    wrappedFetchInternal(fetch, resolve, reject, ...args);
    return promise;
};
exports.default = { wrappedFetch: exports.wrappedFetch };
