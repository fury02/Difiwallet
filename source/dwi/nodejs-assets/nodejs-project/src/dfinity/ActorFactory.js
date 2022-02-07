"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
as `_${Uncapitalize(`]: T[K];
}

export const createExtendedActorClass = (
  agent: HttpAgent,
  methods,
  canisterId: string | Principal,
  IDLFactory: IDL.InterfaceFactory
): ExtendedActorConstructor => {
  class ExtendedActor extends Actor.createActorClass(IDLFactory) {
    constructor() {
      super({ agent, canisterId });

      Object.keys(this).forEach(methodName => {
        this[`, _$, { methodName } `] = this[methodName];
      })

      Object.keys(methods).forEach(methodName => {
        this[methodName] = ((...args: unknown[]) =>
          methods[methodName](this, ...args) as unknown) as ActorMethod;
      });
    }
  }

  return ExtendedActor;
};

export default { createExtendedActorClass };
);
