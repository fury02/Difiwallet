"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require('crypto');
class Entropy {
    getRandomBytes(count) {
        let rb = crypto.randomBytes(count);
        return rb;
    }
}
exports.default = Entropy;
