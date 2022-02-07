"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ IDL }) => {
    return IDL.Service({
        greet: IDL.Func([IDL.Text], [IDL.Text], []),
        http_request: IDL.Func([], [IDL.Text], []),
    });
};
