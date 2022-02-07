import { HttpAgent } from '@dfinity/agent';
import { BinaryBlob, blobFromUint8Array } from '@dfinity/candid';
import crossFetch from 'cross-fetch';
import { PLUG_PROXY_HOST } from '../const/Common';
import { wrappedFetch } from '../communication/WrappedFetch';
import Secp256k1KeyIdentity from "../crypto/Identity_secpk256k1";

export interface CreateAgentArgs {
  secretKey: BinaryBlob;
  defaultIdentity?: Secp256k1KeyIdentity;
  fetch?: any;
}

export const createIdentity = (secretKey: BinaryBlob): Secp256k1KeyIdentity =>
  Secp256k1KeyIdentity.fromSecretKey(secretKey);

export const createAgent = async ({secretKey, fetch = crossFetch}: CreateAgentArgs): Promise<HttpAgent> => {
  const identity = createIdentity(blobFromUint8Array(secretKey));
  const agent = await Promise.resolve(
    new HttpAgent({
      host: process.env.DFX_HOST || PLUG_PROXY_HOST,
      fetch: wrappedFetch(fetch),
      identity,
    })
  ).then(async ag => {
    await ag.fetchRootKey();
    return ag;
  });
  return agent;
};
