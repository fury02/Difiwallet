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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgent = exports.createIdentity = void 0;
const agent_1 = require("@dfinity/agent");
const candid_1 = require("@dfinity/candid");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const Common_1 = require("../const/Common");
const WrappedFetch_1 = require("../communication/WrappedFetch");
const Identity_secpk256k1_1 = __importDefault(require("../crypto/Identity_secpk256k1"));
const createIdentity = (secretKey) => Identity_secpk256k1_1.default.fromSecretKey(secretKey);
exports.createIdentity = createIdentity;
const createAgent = ({ secretKey, fetch = cross_fetch_1.default }) => __awaiter(void 0, void 0, void 0, function* () {
    const identity = (0, exports.createIdentity)((0, candid_1.blobFromUint8Array)(secretKey));
    const agent = yield Promise.resolve(new agent_1.HttpAgent({
        host: process.env.DFX_HOST || Common_1.PLUG_PROXY_HOST,
        fetch: (0, WrappedFetch_1.wrappedFetch)(fetch),
        identity,
    })).then((ag) => __awaiter(void 0, void 0, void 0, function* () {
        yield ag.fetchRootKey();
        return ag;
    }));
    return agent;
});
exports.createAgent = createAgent;
