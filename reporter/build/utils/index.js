"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    if (!Array.isArray(array) || array.length === 0)
        return null;
    return array[Math.floor(Math.random() * array.length)];
};
exports.extractRpcError = function (err) {
    var message = err.message;
    if (err instanceof eosjs_1.RpcError) {
        try {
            message = JSON.parse(err.message).error.details.map(function (detail) {
                return detail.message;
            }).join("\n");
        }
        catch (_a) { }
    }
    else if (err.json) {
        // might only be LiquidAPps client lib
        if (err.json.error)
            return err.json.error;
    }
    return message;
};
// on dev config from real eos is mapped to eostest, telos to telostest
exports.ALL_NETWORKS = ["eos", "telos", "eostest", "telostest"];
exports.NETWORKS_TO_WATCH = exports.isProduction()
    ? ["eos", "telos"]
    : ["eos", "telos"];
//# sourceMappingURL=index.js.map