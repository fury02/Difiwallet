"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ED25519 key derivation path
exports.DERIVATION_PATH = "m/44'/223'/0'/0";
// Dfinity BundleAccount separator
exports.ACCOUNT_DOMAIN_SEPERATOR = '\x0Aaccount-id';
// Subaccounts are arbitrary 32-byte values.
exports.SUB_ACCOUNT_ZERO = Buffer.alloc(32);
exports.HARDENED_OFFSET = 0x80000000;
