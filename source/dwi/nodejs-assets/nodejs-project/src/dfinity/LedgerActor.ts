import { HttpAgent, ActorSubclass } from '@dfinity/agent';

import ledgerMethods, { LedgerServiceExtended } from './LedgerMethods';
import { createExtendedActorClass } from './ActorFactory';
import { LEDGER_CANISTER_ID } from '../const/Common';
import ledgerIDLFactory from '../idls/ledger.did';

export const createLedgerActor = (agent: HttpAgent): ActorSubclass<LedgerServiceExtended> => {
  return (new (createExtendedActorClass(
    agent,
    ledgerMethods,
    LEDGER_CANISTER_ID,
    ledgerIDLFactory
  ))() as unknown) as ActorSubclass<LedgerServiceExtended>;
};

export default createLedgerActor;
