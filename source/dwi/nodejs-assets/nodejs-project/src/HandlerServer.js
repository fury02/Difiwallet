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
const Transaction_1 = __importDefault(require("./utils/Transaction"));
const express = require('express');
const app = express();
const port = 3000;
const History_1 = __importDefault(require("./utils/History"));
const mnemonic_test = 'luxury debris rookie knock add pond float much since gather tobacco creek';
const to_test = '124fda55e2a913e75050d319c95831b534c6354b0d7db28224b9e683f4d73a32';
const send_icp_test = '0.001';
const send_icp_test_big = '1000';
app.get('/', (req, res) => {
    res.send('');
});
app.listen(port, (err) => __awaiter(void 0, void 0, void 0, function* () {
    if (err) {
        return console.error(err);
    }
    //Debug:
    const transactions = new Transaction_1.default(mnemonic_test);
    const balance = yield transactions.getCountICP();
    // const sending = await transactions.transactionICP(to_test, send_icp_test);
    // // const sending_big = await transactions.transactionICP(to_test, send_icp_test_big);
    const history = new History_1.default(mnemonic_test);
    let result = yield history.getICPTransactions();
    return console.log(`server is listening on ${port}`);
}));
