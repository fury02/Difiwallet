"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bip39 = __importStar(require("bip39"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const Entropy_1 = __importDefault(require("../crypto/Entropy"));
const Errors_1 = require("../const/Errors");
const Keys_1 = require("../crypto/Keys");
const Identity_secpk256k1_1 = __importDefault(require("../crypto/Identity_secpk256k1"));
const Binary_1 = require("../crypto/Binary");
const Crypto_1 = require("../const/Crypto");
class BundleAccount {
    constructor() {
        this.entropy = new Entropy_1.default();
    }
    rndMnemonic24() {
        let entropy_bytes = this.entropy.getRandomBytes(32);
        let mnemonic = bip39.entropyToMnemonic(entropy_bytes);
        return mnemonic;
    }
    rndMnemonic18() {
        let entropy_bytes = this.entropy.getRandomBytes(24);
        let mnemonic = bip39.entropyToMnemonic(entropy_bytes);
        return mnemonic;
    }
    rndMnemonic12() {
        let entropy_bytes = this.entropy.getRandomBytes(16);
        let mnemonic = bip39.entropyToMnemonic(entropy_bytes);
        return mnemonic;
    }
    validate(mnemonic, accountId) {
        if (typeof accountId !== 'number' || accountId < 0) {
            return false;
        }
        if (bip39.validateMnemonic(mnemonic)) {
            return false;
        }
        return true;
    }
    identityCreate(mnemonic, accountNumber) {
        const keyPair = (0, Keys_1.createSecp256K1KeyPair)(mnemonic, accountNumber);
        const publicKey = keyPair.publicKey.toRaw();
        const secretKey = keyPair.secretKey;
        const identity = Identity_secpk256k1_1.default.fromKeyPair(publicKey, secretKey);
        return identity;
    }
    create(accountNumber = 0) {
        let mnemonic = this.rndMnemonic12();
        let identity = this.identityCreate(mnemonic, accountNumber);
        let account_id = this.getId(identity.getPrincipal());
        return { mnemonic, account_id, identity, accountNumber };
    }
    createByMnemonic(mnemonic, accountNumber = 0) {
        if (!bip39.validateMnemonic(mnemonic)) {
            throw new Error(Errors_1.Errors.INVALID_MNEMONIC);
        }
        let identity = this.identityCreate(mnemonic, accountNumber);
        let account_id = this.getId(identity.getPrincipal());
        return { mnemonic, account_id, identity, accountNumber };
    }
    getId(principal, subAccount) {
        const sha = crypto_js_1.default.algo.SHA224.create();
        sha.update(Crypto_1.ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
        sha.update((0, Binary_1.byteArrayToWordArray)(principal.toUint8Array()));
        const subBuffer = Buffer.from(Crypto_1.SUB_ACCOUNT_ZERO);
        if (subAccount) {
            subBuffer.writeUInt32BE(subAccount);
        }
        sha.update((0, Binary_1.byteArrayToWordArray)(subBuffer));
        const hash = sha.finalize();
        const byteArray = (0, Binary_1.wordArrayToByteArray)(hash, 28);
        const checksum = (0, Binary_1.generateChecksum)(byteArray);
        const val = checksum + hash.toString();
        return val;
    }
}
exports.default = BundleAccount;
