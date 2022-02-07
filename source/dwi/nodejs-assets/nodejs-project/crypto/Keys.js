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
exports.createSecp256K1KeyPair = exports.createKeyPair = void 0;
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const bip39 = __importStar(require("bip39"));
const ed25519_hd_key_1 = require("ed25519-hd-key");
const hdkey_1 = __importDefault(require("hdkey"));
const secp256k1_1 = __importDefault(require("secp256k1"));
const candid_1 = require("@dfinity/candid");
const Crypto_1 = require("../const/Crypto");
const PublicKey_secpk256k1_1 = __importDefault(require("../crypto/PublicKey_secpk256k1"));
const createKeyPair = (mnemonic, index = 0) => {
    // Generate bip39 mnemonic. [Curve agnostic]
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // Derive key using dfinity's path
    const { key } = (0, ed25519_hd_key_1.derivePath)(Crypto_1.DERIVATION_PATH, seed.toString('hex'), index);
    return tweetnacl_1.default.sign.keyPair.fromSeed(key);
};
exports.createKeyPair = createKeyPair;
const createSecp256K1KeyPair = (mnemonic, index = 0) => {
    // Generate bip39 mnemonic. [Curve agnostic]
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterKey = hdkey_1.default.fromMasterSeed(seed);
    // BIP 44 derivation path definition
    // m / purpose' / coin_type' / account' / change / address_index ---> this being the subaccount index
    const { privateKey } = masterKey.derive(`${Crypto_1.DERIVATION_PATH}/${index}`);
    const publicKey = secp256k1_1.default.publicKeyCreate(privateKey, false);
    return {
        secretKey: privateKey,
        publicKey: PublicKey_secpk256k1_1.default.fromRaw((0, candid_1.blobFromUint8Array)(publicKey)),
    };
};
exports.createSecp256K1KeyPair = createSecp256K1KeyPair;
