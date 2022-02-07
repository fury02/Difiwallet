import Transaction from "./utils/Transaction";

const express = require('express');
const app = express();
const port = 3000;

const mnemonic_test = '';
const address_to_test = '';
const send_icp_test = '0.001';
const send_icp_test_big = '1000';

  app.get('/', (req: any, res: { send: (arg0: string) => void; }) => {
    res.send('');
  });
  app.listen(port, async (err: any) => {
    if (err) {
      return console.error(err);
    }

    //Debug:

    // const transactions = new Transaction(mnemonic_test);
    // const balance = await transactions.getCountICP();

    // const sending = await transactions.transactionICP(address_to_test, send_icp_test);
    // const sending_big = await transactions.transactionICP(address_to_test, send_icp_test_big);

    return console.log(`server is listening on ${port}`);
  });
