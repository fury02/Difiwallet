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
const Account_1 = require("./communication/Account");
const rn_bridge = require('rn-bridge');
const BundleAccount_1 = __importDefault(require("./utils/BundleAccount"));
const Transaction_1 = __importDefault(require("./utils/Transaction"));
const BaseTransaction_1 = require("./communication/BaseTransaction");
const express = require('express');
const app = express();
const accountNumber = 0;
rn_bridge.channel.on('create_account', (msg) => {
    if (msg.toString() == 'create') {
        let bundleAccount = new BundleAccount_1.default();
        let ba = bundleAccount.create();
        let principal = ba.identity.getPrincipal();
        const mnemonic = ba.mnemonic.toString();
        const identity = principal.toString();
        const account_id = ba.account_id.toString();
        let acc = new Account_1.Account();
        acc.Mnemonic = mnemonic;
        acc.Identity = identity;
        acc.AccountId = account_id;
        const json_acc = JSON.stringify(acc);
        rn_bridge.channel.post('create_account', json_acc);
    }
});
rn_bridge.channel.on('balance_account', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = new Transaction_1.default(msg);
    const balance = yield transactions.getCountICP();
    rn_bridge.channel.post('balance_account', balance);
}));
rn_bridge.channel.on('send_icp', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const baseTransaction = new BaseTransaction_1.BaseTransaction().fromJSON(msg);
    const transactions = new Transaction_1.default(baseTransaction.Mnemonic);
    const sendingResult = yield transactions.transactionICP(baseTransaction.Address, baseTransaction.Balance);
    rn_bridge.channel.post('send_icp', sendingResult);
}));
rn_bridge.channel.on('restore_account', (msg) => {
    const json_acc = recovery(msg);
    rn_bridge.channel.post('restore_account', json_acc);
});
rn_bridge.channel.on('saved_account', (msg) => {
    const json_acc = recovery(msg);
    rn_bridge.channel.post('saved_account', json_acc);
});
function recovery(msg) {
    let bundleAccount = new BundleAccount_1.default();
    const mnemonic = msg;
    let ba = bundleAccount.createByMnemonic(mnemonic, accountNumber);
    let principal = ba.identity.getPrincipal();
    const identity = principal.toString();
    const account_id = ba.account_id.toString();
    let acc = new Account_1.Account();
    acc.Mnemonic = mnemonic;
    acc.Identity = identity;
    acc.AccountId = account_id;
    const json_acc = JSON.stringify(acc);
    return json_acc;
}
//**Server-mobile NodeJS received from react-native(https://github.com/nodejs-mobile/nodejs-mobile-samples/blob/master/react-native/UseMultipleChannels/)**//
// rn_bridge.channel.on('message', (msg) => {
//     if(msg.toString() == 'message create account'){
//         let bundleAccount = new BundleAccount();
//         let ba  = bundleAccount.create();
//         let principal = ba.identity.getPrincipal();
//         const mnemonic = ba.mnemonic.toString();
//         const identity = principal.toString();
//         const account_id = ba.account_id.toString();
//
//         let acc = new Account();
//         acc.Mnemonic = mnemonic;
//         acc.Identity = identity;
//         acc.AccountId = account_id;
//
//         const json_acc = JSON.stringify(acc);
//         rn_bridge.channel.send(json_acc);
//     }
//     // if(msg.toString() == ''){
//     //     rn_bridge.channel.send('');
//     // }
// });
// Inform react-native node is initialized.
// rn_bridge.channel.send("Node was initialized.");
