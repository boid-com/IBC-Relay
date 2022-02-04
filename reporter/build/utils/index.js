"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_NETWORKS = exports.extractRpcError = exports.pickRandom = exports.formatBloksTransaction = exports.isProduction = exports.sleep = void 0;
const eosjs_1 = require("eosjs");
exports.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
exports.isProduction = () => process.env.NODE_ENV === `production`;
exports.formatBloksTransaction = (network, txId) => {
    let bloksSubdomain = `bloks.io`;
    if (exports.isProduction()) {
        switch (network) {
            case `eos`:
                bloksSubdomain = `bloks.io`;
                break;
            case `telos`:
                bloksSubdomain = `telos.bloks.io`;
                break;
            case `wax`:
                bloksSubdomain = `wax.bloks.io`;
                break;
        }
    }
    else {
        switch (network) {
            case `eos`:
                bloksSubdomain = `jungle3.bloks.io`;
                break;
            case `telos`:
                bloksSubdomain = `telos-test.bloks.io`;
                break;
            case `wax`:
                bloksSubdomain = `wax-test.bloks.io`;
                break;
        }
    }
    return `https://${bloksSubdomain}/transaction/${txId}`;
};
exports.pickRandom = (array) => {
    if (!Array.isArray(array) || array.length === 0)
        return null;
    return array[Math.floor(Math.random() * array.length)];
};
exports.extractRpcError = (err) => {
    let message = err.message;
    if (err instanceof eosjs_1.RpcError) {
        try {
            message = JSON.parse(err.message).error.details.map(detail => {
                return detail.message;
            }).join(`\n`);
        }
        catch { }
    }
    else if (err.json) {
        // might only be LiquidAPps client lib
        if (err.json.error)
            return err.json.error;
    }
    return message;
};
exports.ALL_NETWORKS = [`eos`, `telos`, `wax`];
//# sourceMappingURL=index.js.map