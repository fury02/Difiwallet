"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLedgerActor = void 0;
const LedgerMethods_1 = __importDefault(require("./LedgerMethods"));
const ActorFactory_1 = require("./ActorFactory");
const Common_1 = require("../const/Common");
const ledger_did_1 = __importDefault(require("../idls/ledger.did"));
const createLedgerActor = (agent) => {
    return new ((0, ActorFactory_1.createExtendedActorClass)(agent, LedgerMethods_1.default, Common_1.LEDGER_CANISTER_ID, ledger_did_1.default))();
};
exports.createLedgerActor = createLedgerActor;
exports.default = exports.createLedgerActor;
