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
const BundleAccount_1 = __importDefault(require("./BundleAccount"));
const Agent_1 = require("../dfinity/Agent");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const LedgerActor_1 = __importDefault(require("../dfinity/LedgerActor"));
const DECIMALS = 8;
class Transaction {
    constructor(mnemonic) {
        this.bundleAccount = new BundleAccount_1.default();
        this.ba = this.bundleAccount.createByMnemonic(mnemonic);
        this.accountId = this.ba.account_id.toString();
        this.secp256k1KeyIdentity = this.ba.identity;
        this.keysPair = this.secp256k1KeyIdentity.getKeyPair();
    }
    transactionICP(to, amount, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKey = this.keysPair.secretKey;
            const fetch = cross_fetch_1.default;
            const agent = yield Agent_1.createAgent({ secretKey, fetch });
            const ledger = yield LedgerActor_1.default(agent);
            const sending = yield ledger.sendICP({ to, amount, opts });
            return sending;
        });
    }
    getCountICP() {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this.getBalanceICP();
            return this.parseBalance(balance);
        });
    }
    getBalanceICP() {
        return __awaiter(this, void 0, void 0, function* () {
            const secretKey = this.keysPair.secretKey;
            const fetch = cross_fetch_1.default;
            const agent = yield Agent_1.createAgent({ secretKey, fetch });
            const ledger = yield LedgerActor_1.default(agent);
            const balance = yield ledger.getBalance(this.accountId);
            return balance;
        });
    }
    parseBalance(balance) {
        return (parseInt(balance.value, 10) / 10 ** balance.decimals).toString();
    }
}
exports.default = Transaction;
