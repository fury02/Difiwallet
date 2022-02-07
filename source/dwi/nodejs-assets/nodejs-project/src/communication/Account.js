"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_serializable_1 = require("ts-serializable");
require("reflect-metadata");
class Account extends ts_serializable_1.Serializable {
    constructor() {
        super(...arguments);
        this.Mnemonic = '';
        this.Identity = '';
        this.AccountId = '';
    }
}
__decorate([
    ts_serializable_1.jsonProperty(String)
], Account.prototype, "Mnemonic", void 0);
__decorate([
    ts_serializable_1.jsonProperty(String)
], Account.prototype, "Identity", void 0);
__decorate([
    ts_serializable_1.jsonProperty(String)
], Account.prototype, "AccountId", void 0);
exports.Account = Account;
