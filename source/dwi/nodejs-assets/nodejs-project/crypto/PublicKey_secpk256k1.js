"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const candid_1 = require("@dfinity/candid");
// This implementation is adjusted from the Ed25519PublicKey.
// The RAW_KEY_LENGTH and DER_PREFIX are modified accordingly
class Secp256k1PublicKey {
    // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
    constructor(key) {
        this.rawKey = key;
        this.derKey = Secp256k1PublicKey.derEncode(key);
    }
    static fromRaw(rawKey) {
        return new Secp256k1PublicKey(rawKey);
    }
    static fromDer(derKey) {
        return new Secp256k1PublicKey(this.derDecode(derKey));
    }
    static from(key) {
        return this.fromDer(key.toDer());
    }
    static derEncode(publicKey) {
        if (publicKey.byteLength !== Secp256k1PublicKey.RAW_KEY_LENGTH) {
            const bl = publicKey.byteLength;
            throw new TypeError(`secp256k1 public key must be ${Secp256k1PublicKey.RAW_KEY_LENGTH} bytes long (is ${bl})`);
        }
        const derPublicKey = Uint8Array.from([
            ...Secp256k1PublicKey.DER_PREFIX,
            ...new Uint8Array(publicKey),
        ]);
        return (0, candid_1.derBlobFromBlob)((0, candid_1.blobFromUint8Array)(derPublicKey));
    }
    static derDecode(key) {
        const expectedLength = Secp256k1PublicKey.DER_PREFIX.length + Secp256k1PublicKey.RAW_KEY_LENGTH;
        if (key.byteLength !== expectedLength) {
            const bl = key.byteLength;
            throw new TypeError(`secp256k1 DER-encoded public key must be ${expectedLength} bytes long (is ${bl})`);
        }
        const rawKey = (0, candid_1.blobFromUint8Array)(key.subarray(Secp256k1PublicKey.DER_PREFIX.length));
        if (!this.derEncode(rawKey).equals(key)) {
            throw new TypeError('secp256k1 DER-encoded public key is invalid. A valid secp256k1 DER-encoded public key ' +
                `must have the following prefix: ${Secp256k1PublicKey.DER_PREFIX}`);
        }
        return rawKey;
    }
    toDer() {
        return this.derKey;
    }
    toRaw() {
        return this.rawKey;
    }
}
// The length of secp256k1 public keys is always 65 bytes.
Secp256k1PublicKey.RAW_KEY_LENGTH = 65;
// Adding this prefix to a raw public key is sufficient to DER-encode it.
// prettier-ignore
Secp256k1PublicKey.DER_PREFIX = Uint8Array.from([
    0x30, 0x56,
    0x30, 0x10,
    0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
    0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x0a,
    0x03, 0x42,
    0x00, // no padding
]);
exports.default = Secp256k1PublicKey;
