"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExtendedActorClass = void 0;
const agent_1 = require("@dfinity/agent");
const createExtendedActorClass = (agent, methods, canisterId, IDLFactory) => {
    class ExtendedActor extends agent_1.Actor.createActorClass(IDLFactory) {
        constructor() {
            super({ agent, canisterId });
            Object.keys(this).forEach(methodName => {
                this[`_${methodName}`] = this[methodName];
            });
            Object.keys(methods).forEach(methodName => {
                this[methodName] = ((...args) => methods[methodName](this, ...args));
            });
        }
    }
    return ExtendedActor;
};
exports.createExtendedActorClass = createExtendedActorClass;
exports.default = { createExtendedActorClass: exports.createExtendedActorClass };
