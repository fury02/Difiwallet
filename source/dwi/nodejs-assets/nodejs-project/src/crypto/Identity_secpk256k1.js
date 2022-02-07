"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-underscore-dangle */
const secp256k1_1 = __importDefault(require("secp256k1"));
const js_sha256_1 = require("js-sha256");
const candid_1 = require("@dfinity/candid");
const agent_1 = require("@dfinity/agent");
const PublicKey_secpk256k1_1 = __importDefault(require("./PublicKey_secpk256k1"));
const PEM_BEGIN = '-----BEGIN PRIVATE KEY-----';
const PEM_END = '-----END PRIVATE KEY-----';
const PRIV_KEY_INIT = '308184020100301006072a8648ce3d020106052b8104000a046d306b0201010420';
const KEY_SEPARATOR = 'a144034200';
class Secp256k1KeyIdentity extends agent_1.SignIdentity {
    // `fromRaw` and `fromDer` should be used for instantiation, not this constructor.
    constructor(publicKey, _privateKey) {
        super();
        this._privateKey = _privateKey;
        this._publicKey = PublicKey_secpk256k1_1.default.from(publicKey);
    }
    static fromParsedJson(obj) {
        const [publicKeyRaw, privateKeyRaw] = obj;
        return new Secp256k1KeyIdentity(PublicKey_secpk256k1_1.default.fromRaw(candid_1.blobFromHex(publicKeyRaw)), candid_1.blobFromHex(privateKeyRaw));
    }
    static fromJSON(json) {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
            if (typeof parsed[0] === 'string' && typeof parsed[1] === 'string') {
                return this.fromParsedJson([parsed[0], parsed[1]]);
            }
            throw new Error('Deserialization error: JSON must have at least 2 items.');
        }
        else if (typeof parsed === 'object' && parsed !== null) {
            const { publicKey, _publicKey, secretKey, _privateKey } = parsed;
            const pk = publicKey
                ? PublicKey_secpk256k1_1.default.fromRaw(candid_1.blobFromUint8Array(new Uint8Array(publicKey.data)))
                : PublicKey_secpk256k1_1.default.fromDer(candid_1.blobFromUint8Array(new Uint8Array(_publicKey.data)));
            if (publicKey && secretKey && secretKey.data) {
                return new Secp256k1KeyIdentity(pk, candid_1.blobFromUint8Array(new Uint8Array(secretKey.data)));
            }
            if (_publicKey && _privateKey && _privateKey.data) {
                return new Secp256k1KeyIdentity(pk, candid_1.blobFromUint8Array(new Uint8Array(_privateKey.data)));
            }
        }
        throw new Error(`Deserialization error: Invalid JSON type for string: ${JSON.stringify(json)}`);
    }
    static fromKeyPair(publicKey, privateKey) {
        return new Secp256k1KeyIdentity(PublicKey_secpk256k1_1.default.fromRaw(publicKey), privateKey);
    }
    static fromSecretKey(secretKey) {
        const publicKey = secp256k1_1.default.publicKeyCreate(new Uint8Array(secretKey), false);
        const identity = Secp256k1KeyIdentity.fromKeyPair(candid_1.blobFromUint8Array(publicKey), candid_1.blobFromUint8Array(new Uint8Array(secretKey)));
        return identity;
    }
    /**
     * Serialize this key to JSON.
     */
    toJSON() {
        return [candid_1.blobToHex(this._publicKey.toRaw()), candid_1.blobToHex(this._privateKey)];
    }
    /**
     * Return a copy of the key pair.
     */
    getKeyPair() {
        return {
            secretKey: candid_1.blobFromUint8Array(new Uint8Array(this._privateKey)),
            publicKey: this._publicKey,
        };
    }
    /**
     * Return the public key.
     */
    getPublicKey() {
        return this._publicKey;
    }
    /**
     *  Return private key in a pem file
     */
    getPem() {
        const rawPrivateKey = this._privateKey.toString('hex');
        const rawPublicKey = this._publicKey.toRaw().toString('hex');
        return `${PEM_BEGIN}\n${Buffer.from(`${PRIV_KEY_INIT}${rawPrivateKey}${KEY_SEPARATOR}${rawPublicKey}`, 'hex').toString('base64')}\n${PEM_END}`;
    }
    /**
     * Signs a blob of data, with this identity's private key.
     * @param challenge - challenge to sign with this identity's secretKey, producing a signature
     */
    sign(challenge) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = js_sha256_1.sha256.create();
            hash.update(challenge);
            const { signature } = secp256k1_1.default.ecdsaSign(new Uint8Array(hash.digest()), this._privateKey);
            return candid_1.blobFromUint8Array(signature);
        });
    }
}
exports.default = Secp256k1KeyIdentity;
