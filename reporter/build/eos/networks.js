"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpc = exports.getContractsForNetwork = void 0;
var eosjs_1 = require("eosjs");
var node_fetch_1 = __importDefault(require("node-fetch"));
var dotenv_1 = require("../dotenv");
var utils_1 = require("../utils");
exports.getContractsForNetwork = function (network) {
    network = utils_1.unmapNetworkName(network);
    var envConfig = dotenv_1.getEnvConfig();
    switch (network) {
        case "eostest":
            return __assign({ ibc: "tlosd.eos.io", cpuPayer: "telosdcpunet" }, (envConfig.eostest || {}));
        case "telostest":
            return __assign({ ibc: "telosd.io", cpuPayer: "admin.swaps" }, (envConfig.telostest || {}));
        case "eos":
            return __assign({ ibc: "telosd.io", cpuPayer: "telosdcpunet" }, (envConfig.eos || {}));
        case "telos":
            return __assign({ ibc: "telosd.io", cpuPayer: "admin.swaps" }, (envConfig.telos || {}));
        default:
            throw new Error("No contract accounts for \"" + network + "\" network defined yet");
    }
};
var createNetwork = function (nodeEndpoint, chainId) {
    var matches = /^(https?):\/\/(.+?)(:\d+){0,1}$/.exec(nodeEndpoint);
    if (!matches) {
        throw new Error("Could not parse HTTP endpoint for chain " + chainId + ". Needs protocol and port: \"" + nodeEndpoint + "\"");
    }
    var httpProtocol = matches[1], host = matches[2], portMatch = matches[3];
    var portString = portMatch
        ? portMatch.replace(/\D/gi, "")
        : httpProtocol === "https"
            ? "443"
            : "80";
    var port = Number.parseInt(portString, 10);
    return {
        chainId: chainId,
        protocol: httpProtocol,
        host: host,
        port: port,
        nodeEndpoint: nodeEndpoint,
    };
};
var EosTestNetwork = createNetwork(process.env.EOSTEST_ENDPOINT || "https://testnet.telos.africa:443", "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f");
var TelosTestNetwork = createNetwork(process.env.TELOSTEST_ENDPOINT || "https://testnet.telos.africa:443", "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f");
var EosNetwork = createNetwork(process.env.EOS_ENDPOINT, "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906");
var TelosNetwork = createNetwork(process.env.TELOS_ENDPOINT, "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11");
function getNetwork(networkName) {
    switch (networkName) {
        case "eos":
            return EosNetwork;
        case "telos":
            return TelosNetwork;
        case "eostest":
            return EosTestNetwork;
        case "telostest":
            return TelosTestNetwork;
        default:
            throw new Error("Network \"" + networkName + "\" not supported yet.");
    }
}
exports.getRpc = (function () {
    var rpcs = {};
    return function (networkName) {
        var _networkName = utils_1.unmapNetworkName(networkName);
        if (!rpcs[networkName]) {
            rpcs[networkName] = new eosjs_1.JsonRpc(getNetwork(_networkName).nodeEndpoint, {
                fetch: node_fetch_1.default,
            });
        }
        return rpcs[networkName];
    };
})();
//# sourceMappingURL=networks.js.map