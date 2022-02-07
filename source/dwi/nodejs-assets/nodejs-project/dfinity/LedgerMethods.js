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
Object.defineProperty(exports, "__esModule", { value: true });
const DECIMALS = 8;
const sendICP = (actor, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, amount, opts } = args;
    const defaultArgs = {
        fee: BigInt(10000),
        memo: BigInt(0),
    };
    const parsedAmount = BigInt(parseFloat(amount) * 10 ** DECIMALS);
    return actor._send_dfx({
        to,
        fee: { e8s: (opts === null || opts === void 0 ? void 0 : opts.fee) || defaultArgs.fee },
        amount: { e8s: parsedAmount },
        memo: (opts === null || opts === void 0 ? void 0 : opts.memo) ? BigInt(opts.memo) : defaultArgs.memo,
        from_subaccount: [],
        created_at_time: [],
    });
});
const getBalance = (actor, accountId) => __awaiter(void 0, void 0, void 0, function* () {
    const balance = yield actor._account_balance_dfx({ account: accountId });
    return { value: balance.e8s.toString(), decimals: DECIMALS };
});
exports.default = { sendICP, getBalance };
