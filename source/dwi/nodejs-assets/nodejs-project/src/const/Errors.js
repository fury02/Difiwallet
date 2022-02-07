"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = {
    INVALID_MNEMONIC: 'The provided mnemonic is invalid',
    INVALID_ACC_ID: 'The account ID should be a positive integer',
    PASSWORD_REQUIRED: 'A password is required',
    NOT_INITIALIZED: 'Wallet must be initialized',
    STATE_LOCKED: 'The state is locked',
    INVALID_WALLET_NUMBER: 'Invalid wallet number',
    GET_TRANSACTIONS_FAILS: 'Get dfinity fails',
    INVALID_CANISTER_ID: 'The provided canister id is invalid',
    TOKEN_NOT_SUPPORTED: 'The provided canister does not implement common extensions from EXT token interfaces.',
    NON_FUNGIBLE_TOKEN_NOT_SUPPORTED: 'Non fungible tokens are not supported yet',
    TOKEN_NOT_SUPPORT_METADATA: 'The provided canister does not implement commont extension',
    INVALID_PRINCIPAL_ID: 'Invalid principal id',
    INVALID_APP: 'Invalid app',
};
