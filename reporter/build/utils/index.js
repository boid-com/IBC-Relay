"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
exports.NETWORKS_TO_WATCH = exports.ALL_NETWORKS = exports.extractRpcError = exports.pickRandom = exports.unmapNetworkName = exports.formatBloksTransaction = exports.isProduction = exports.sleep = void 0;
var eosjs_1 = require("eosjs");
exports.sleep = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.isProduction = function () { return process.env.NODE_ENV === "production"; };
exports.formatBloksTransaction = function (network, txId) {
    var _network = exports.unmapNetworkName(network);
    var bloksNetworkName = _network;
    if (_network === "eos")
        bloksNetworkName = "";
    else if (_network === "telostest")
        bloksNetworkName = "telos-test";
    var prefix = bloksNetworkName ? bloksNetworkName + "." : "";
    return "https://" + prefix + "bloks.io/transaction/" + txId;
};
// export const mapNetworkName = (network: NetworkName): NetworkName => {
//   if (isProduction()) {
//     return network;
//   }
//   switch (network) {
//     case `eostest`:
//       return `eos`;
//     case `telostest`:
//       return `telos`;
//   }
// };
exports.unmapNetworkName = function (network) {
    if (exports.isProduction()) {
        return network;
    }
    switch (network) {
        case "eos":
            return "eostest";
        case "telos":
            return "telostest";
    }
};
exports.pickRandom = function (array) {
=======
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
>>>>>>> boid
    if (!Array.isArray(array) || array.length === 0)
        return null;
    return array[Math.floor(Math.random() * array.length)];
};
<<<<<<< HEAD
exports.extractRpcError = function (err) {
    var message = err.message;
    if (err instanceof eosjs_1.RpcError) {
        try {
            message = JSON.parse(err.message).error.details.map(function (detail) {
                return detail.message;
            }).join("\n");
        }
        catch (_a) { }
=======
exports.extractRpcError = (err) => {
    let message = err.message;
    if (err instanceof eosjs_1.RpcError) {
        try {
            message = JSON.parse(err.message).error.details.map(detail => {
                return detail.message;
            }).join(`\n`);
        }
        catch { }
>>>>>>> boid
    }
    else if (err.json) {
        // might only be LiquidAPps client lib
        if (err.json.error)
            return err.json.error;
    }
    return message;
};
<<<<<<< HEAD
// on dev config from real eos is mapped to eostest, telos to telostest
exports.ALL_NETWORKS = ["eos", "telos", "eostest", "telostest"];
exports.NETWORKS_TO_WATCH = exports.isProduction()
    ? ["eos", "telos"]
    : ["eos", "telos"];
=======
exports.ALL_NETWORKS = [`eos`, `telos`, `wax`];
>>>>>>> boid
//# sourceMappingURL=index.js.map