import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import Entropy from '../crypto/Entropy';
import {Errors} from '../const/Errors';
import {createSecp256K1KeyPair} from '../crypto/Keys';
import Secp256k1KeyIdentity from '../crypto/Identity_secpk256k1';
import { byteArrayToWordArray, generateChecksum, wordArrayToByteArray, wordToByteArray } from "../crypto/Binary";
import {Principal } from '@dfinity/principal';
import { ACCOUNT_DOMAIN_SEPERATOR, SUB_ACCOUNT_ZERO } from "../const/Crypto";

class BundleAccount {
  private entropy: any;
  constructor() {
    this.entropy = new Entropy();
  }
  private rndMnemonic24(): string{
    let entropy_bytes = this.entropy.getRandomBytes(32);
    let mnemonic = bip39.entropyToMnemonic(entropy_bytes);
    return mnemonic;
  }

  private rndMnemonic18(): string{
    let entropy_bytes = this.entropy.getRandomBytes(24);
    let  mnemonic = bip39.entropyToMnemonic(entropy_bytes);
    return mnemonic;
  }

  private rndMnemonic12(): string{
    let entropy_bytes = this.entropy.getRandomBytes(16);
    let mnemonic = bip39.entropyToMnemonic(entropy_bytes);
    return mnemonic;
  }

  private validate(mnemonic: string,
                  accountId: number): Boolean{
    if (typeof accountId !== 'number' || accountId < 0) { return false; }
    if (bip39.validateMnemonic(mnemonic)) { return false; }
    return true;
  }

  private identityCreate(mnemonic: string, accountNumber: number): Secp256k1KeyIdentity{
    const keyPair = createSecp256K1KeyPair(mnemonic, accountNumber);
    const publicKey = keyPair.publicKey.toRaw();
    const secretKey = keyPair.secretKey;
    const identity = Secp256k1KeyIdentity.fromKeyPair(publicKey, secretKey);
    return identity;
  }

  public create(accountNumber = 0): any{
    let mnemonic = this.rndMnemonic12();
    let identity = this.identityCreate(mnemonic, accountNumber);
    let account_id = this.getId(identity.getPrincipal());
    return {mnemonic, account_id, identity, accountNumber};
  }

  public createByMnemonic(mnemonic: string, accountNumber = 0): any{
    if(!bip39.validateMnemonic(mnemonic)){
      throw new Error(Errors.INVALID_MNEMONIC);
    }
    let identity = this.identityCreate(mnemonic, accountNumber);
    let account_id = this.getId(identity.getPrincipal());
    return {mnemonic, account_id, identity, accountNumber};
  }

  public getId( principal: Principal, subAccount?: number ): string {
    const sha = CryptoJS.algo.SHA224.create();
    sha.update(ACCOUNT_DOMAIN_SEPERATOR); // Internally parsed with UTF-8, like go does
    sha.update(byteArrayToWordArray(principal.toUint8Array()));
    const subBuffer = Buffer.from(SUB_ACCOUNT_ZERO);
    if (subAccount) {
      subBuffer.writeUInt32BE(subAccount);
    }
    sha.update(byteArrayToWordArray(subBuffer));
    const hash = sha.finalize();
    const byteArray = wordArrayToByteArray(hash, 28);
    const checksum = generateChecksum(byteArray);
    const val = checksum + hash.toString();
    return val;
  }
}
export default BundleAccount;
