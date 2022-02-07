import crossFetch from "cross-fetch";
import {NET_ID, ROSETTA_URL} from "../const/Common";
import {Errors} from "../const/Errors";
import { Balance, GetTransactionsResponse, InferredTransaction, RosettaTransaction } from "../interfaces/Common";
import bigInt from "big-integer";


export const MILI_PER_SECOND = 1000000;

class HistoryOperations {
  private accountId: string;
  private fetch = crossFetch;

  constructor(accountId: string) {
    this.accountId = accountId;
  }

  private parseBalance(balance: Balance): string{
    return (parseInt(balance.value, 10) / 10 ** balance.decimals).toString();
  }

  public async getICPTransactions(): Promise<GetTransactionsResponse>{
      const response = await this.fetch(`${ROSETTA_URL}/search/transactions`, {
        method: 'POST',
        body: JSON.stringify({
          network_identifier: NET_ID,
          account_identifier: {
            address: this.accountId,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
        },
      });
      if (!response.ok)
        throw Error(`${Errors.GET_TRANSACTIONS_FAILS} ${response.statusText}`);

      const response_json = await response.json();
      const transactions = response_json.transactions;
      const total_count = response_json.total_count;

      const transactionsInfo = transactions.map(({ transaction }) => this.getTransactionInfo(this.accountId, transaction));
      return transactionsInfo;
  }

  public getTransactionInfo(accountId: string, rosettaTransaction: RosettaTransaction ): InferredTransaction {
    const { operations, metadata: { timestamp }, transaction_identifier: { hash }, } = rosettaTransaction;
    const transaction: any = { details: { status: 'COMPLETED', fee: {} } };
    operations.forEach(operation => {

      const value = bigInt(operation.amount.value);

      const { decimals } = operation.amount.currency;
      const amount = this.parseBalance({ value: value.toString(), decimals });
      if (operation.type === 'FEE') {
        transaction.details.fee.amount = amount;
        transaction.details.fee.currency = operation.amount.currency;
        return;
      }

      if (value >= 0) transaction.details.to = operation.account.address;
      if (value <= 0) transaction.details.from = operation.account.address;

      if (
        transaction.details.status === 'COMPLETED' &&
        operation.status !== 'COMPLETED'
      )
        transaction.details.status = operation.status;

      transaction.type = transaction.details.to === accountId ? 'RECEIVE' : 'SEND';
      transaction.details.amount = amount;
      transaction.details.currency = operation.amount.currency;
    });
    return {
      ...transaction,
      caller: transaction.details.from,
      hash,
      timestamp: timestamp / MILI_PER_SECOND,
    } as InferredTransaction;
  };
}
export default HistoryOperations;
