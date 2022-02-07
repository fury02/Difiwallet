import Entropy from "../crypto/Entropy";
import BundleAccount from "./BundleAccount";
import Secp256k1KeyIdentity from "../crypto/Identity_secpk256k1";
import { Secp256k1KeyPair } from "../crypto/Keys";
import { BaseMethodsExtendedActor } from "../dfinity/ActorFactory";
import LedgerService, { TimeStamp } from '../interfaces/Ledger';
import { ActorSubclass } from "@dfinity/agent";
import { createAgent } from "../dfinity/Agent";
import crossFetch from "cross-fetch";
import createLedgerActor from "../dfinity/LedgerActor";
import { Balance, SendOpts } from "../dfinity/LedgerMethods";
type BaseLedgerService = BaseMethodsExtendedActor<LedgerService>;
const DECIMALS = 8;

class Transaction{
  private bundleAccount: BundleAccount;
  private ba: any;
  private secp256k1KeyIdentity: Secp256k1KeyIdentity;
  private keysPair: Secp256k1KeyPair;
  private accountId: string;

  constructor(mnemonic: string) {
    this.bundleAccount = new BundleAccount();
    this.ba = this.bundleAccount.createByMnemonic(mnemonic);
    this.accountId = this.ba.account_id.toString();
    this.secp256k1KeyIdentity = this.ba.identity;
    this.keysPair = this.secp256k1KeyIdentity.getKeyPair();
  }

  public async transactionICP(to: string, amount: string, opts?: SendOpts): Promise<string> {
    const secretKey = this.keysPair.secretKey;
    const fetch = crossFetch;
    const agent = await createAgent({ secretKey, fetch});
    const ledger = await createLedgerActor(agent);
    const sending = await ledger.sendICP({to, amount, opts});
    return sending;
  }

  public async getCountICP(): string{
    const balance = await this.getBalanceICP();
    return this.parseBalance(balance);
  }

  private async getBalanceICP(): Promise<Balance>{
    const secretKey = this.keysPair.secretKey;
    const fetch = crossFetch;
    const agent = await createAgent({ secretKey, fetch});
    const ledger = await createLedgerActor(agent);
    const balance = await ledger.getBalance(this.accountId);
    return balance;
  }

  private parseBalance(balance: Balance): string{
    return (parseInt(balance.value, 10) / 10 ** balance.decimals).toString();
  }
}
export default Transaction;

