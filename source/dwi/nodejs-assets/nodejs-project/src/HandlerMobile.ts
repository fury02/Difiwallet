import { Account } from "./communication/Account";
const rn_bridge = require('rn-bridge');
import BundleAccount from "./utils/BundleAccount";
import { constants } from "os";
import priority = module
import Transaction from "./utils/Transaction";
import { BaseTransaction } from "./communication/BaseTransaction";
const express = require('express');
const app = express();
const accountNumber = 0;
rn_bridge.channel.on('create_account', (msg) => {
  if(msg.toString() == 'create'){
    try {
      let bundleAccount = new BundleAccount();
      let ba  = bundleAccount.create();
      let principal = ba.identity.getPrincipal();
      const mnemonic = ba.mnemonic.toString();
      const identity = principal.toString();
      const account_id = ba.account_id.toString();

      let acc = new Account();
      acc.Mnemonic = mnemonic;
      acc.Identity = identity;
      acc.AccountId = account_id;

      const json_acc = JSON.stringify(acc);
      rn_bridge.channel.post('create_account', json_acc);
    }
    catch (error){console.log(error);}
  }
});
rn_bridge.channel.on('balance_account', async (msg) => {
  try {
    const transactions = new Transaction(msg);
    const balance = await transactions.getCountICP();
    rn_bridge.channel.post('balance_account', balance);
  }
  catch (error){console.log(error);}
});
rn_bridge.channel.on('send_icp', async (msg) => {
  try {
    const baseTransaction = new BaseTransaction().fromJSON(msg);
    const transactions = new Transaction(baseTransaction.Mnemonic);

    // rn_bridge.channel.post('send_icp', 'sending...');

    const sendingResult = await transactions.transactionICP(baseTransaction.Address, baseTransaction.Balance);
    rn_bridge.channel.post('send_icp', sendingResult);
  }
  catch (error){console.log(error);}
});
rn_bridge.channel.on('restore_account', (msg) => {
  try {
    const json_acc = recovery(msg);
    rn_bridge.channel.post('restore_account', json_acc);
  }
  catch (error){console.log(error);}
});
rn_bridge.channel.on('saved_account', (msg) => {
  try {
    const json_acc = recovery(msg);
    rn_bridge.channel.post('saved_account', json_acc);
  }
  catch (error){console.log(error);}
});

function recovery(msg: string): string{
  try {
    let bundleAccount = new BundleAccount();
    const mnemonic = msg;
    let ba = bundleAccount.createByMnemonic(mnemonic, accountNumber);
    let principal = ba.identity.getPrincipal();
    const identity = principal.toString();
    const account_id = ba.account_id.toString();

    let acc = new Account();
    acc.Mnemonic = mnemonic;
    acc.Identity = identity;
    acc.AccountId = account_id;

    const json_acc = JSON.stringify(acc);
    return json_acc;
  }
  catch (error){
    console.log(error);
    return '';
  }
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
