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
const express = require('express');
const app = express();
const port = 3000;
const mnemonic_test = '';
const address_to_test = '';
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
    // const transactions = new Transaction(mnemonic_test);
    // const balance = await transactions.getCountICP();
    // const sending = await transactions.transactionICP(address_to_test, send_icp_test);
    // const sending_big = await transactions.transactionICP(address_to_test, send_icp_test_big);
    return console.log(`server is listening on ${port}`);
}));
