export interface Balance {
  value: string;
  decimals: number;
}

export interface InferredTransaction {
  hash: string;
  timestamp: bigint;
  type: string;
  details?: { [key: string]: any };
  caller: string;
}
export interface GetTransactionsResponse {
  total: number;
  transactions: InferredTransaction[];
}

export interface Operation {
  account: {
    address: string;
  };
  amount: {
    value: string;
    currency: {
      symbol: string;
      decimals: number;
    };
  };
  status: 'COMPLETED' | 'REVERTED' | 'PENDING';
  type: 'TRANSACTION' | 'FEE';
}

export interface RosettaTransaction {
  metadata: {
    block_height: number;
    memo: number;
    timestamp: number;
    lockTime: number;
  };
  operations: Operation[];
  transaction_identifier: { hash: string };
}
