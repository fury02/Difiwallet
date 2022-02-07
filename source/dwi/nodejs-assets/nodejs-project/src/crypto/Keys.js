"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const bip39 = __importStar(require("bip39"));
const ed25519_hd_key_1 = require("ed25519-hd-key");
const hdkey_1 = __importDefault(require("hdkey"));
const secp256k1_1 = __importDefault(require("secp256k1"));
const candid_1 = require("@dfinity/candid");
const Crypto_1 = require("../const/Crypto");
const PublicKey_secpk256k1_1 = __importDefault(require("../crypto/PublicKey_secpk256k1"));
exports.createKeyPair = (mnemonic, index = 0) => {
    // Generate bip39 mnemonic. [Curve agnostic]
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // Derive key using dfinity's path
    const { key } = ed25519_hd_key_1.derivePath(Crypto_1.DERIVATION_PATH, seed.toString('hex'), index);
    return tweetnacl_1.default.sign.keyPair.fromSeed(key);
};
exports.createSecp256K1KeyPair = (mnemonic, index = 0) => {
    // Generate bip39 mnemonic. [Curve agnostic]
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const masterKey = hdkey_1.default.fromMasterSeed(seed);
    // BIP 44 derivation path definition
    // m / purpose' / coin_type' / account' / change / address_index ---> this being the subaccount index
    const { privateKey } = masterKey.derive(`${Crypto_1.DERIVATION_PATH}/${index}`);
    const publicKey = secp256k1_1.default.publicKeyCreate(privateKey, false);
    return {
        secretKey: privateKey,
        publicKey: PublicKey_secpk256k1_1.default.fromRaw(candid_1.blobFromUint8Array(publicKey)),
    };
};
