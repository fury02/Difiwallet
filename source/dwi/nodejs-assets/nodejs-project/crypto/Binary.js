"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChecksum = exports.intToHex = exports.wordArrayToByteArray = exports.wordToByteArray = exports.byteArrayToWordArray = void 0;
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-bitwise */
const buffer_crc32_1 = __importDefault(require("buffer-crc32"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const byteArrayToWordArray = (byteArray) => {
    const wordArray = [];
    let i;
    for (i = 0; i < byteArray.length; i += 1) {
        wordArray[(i / 4) | 0] |= byteArray[i] << (24 - 8 * i);
    }
    // eslint-disable-next-line
    const result = crypto_js_1.default.lib.WordArray.create(wordArray, byteArray.length);
    return result;
};
exports.byteArrayToWordArray = byteArrayToWordArray;
const wordToByteArray = (word, length) => {
    const byteArray = [];
    const xFF = 0xff;
    if (length > 0)
        byteArray.push(word >>> 24);
    if (length > 1)
        byteArray.push((word >>> 16) & xFF);
    if (length > 2)
        byteArray.push((word >>> 8) & xFF);
    if (length > 3)
        byteArray.push(word & xFF);
    return byteArray;
};
exports.wordToByteArray = wordToByteArray;
const wordArrayToByteArray = (wordArray, length) => {
    if (wordArray.hasOwnProperty('sigBytes') &&
        wordArray.hasOwnProperty('words')) {
        length = wordArray.sigBytes;
        wordArray = wordArray.words;
    }
    let result = [];
    let bytes;
    let i = 0;
    while (length > 0) {
        bytes = (0, exports.wordToByteArray)(wordArray[i], Math.min(4, length));
        length -= bytes.length;
        result = [...result, bytes];
        i++;
    }
    return [].concat.apply([], result);
};
exports.wordArrayToByteArray = wordArrayToByteArray;
const intToHex = (val) => val < 0 ? (Number(val) >>> 0).toString(16) : Number(val).toString(16);
exports.intToHex = intToHex;
// We generate a CRC32 checksum, and trnasform it into a hexString
const generateChecksum = (hash) => {
    const crc = buffer_crc32_1.default.unsigned(Buffer.from(hash));
    const hex = (0, exports.intToHex)(crc);
    return hex.padStart(8, '0');
};
exports.generateChecksum = generateChecksum;
