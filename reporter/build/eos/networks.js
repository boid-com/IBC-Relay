"use strict";
<<<<<<< HEAD
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
=======
>>>>>>> boid
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpc = exports.getContractsForNetwork = void 0;
<<<<<<< HEAD
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
=======
const eosjs_1 = require("eosjs");
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = require("../dotenv");
const utils_1 = require("../utils");
exports.getContractsForNetwork = (network) => {
    const envConfig = dotenv_1.getEnvConfig();
    if (utils_1.isProduction()) {
        switch (network) {
            case `eos`:
                return { ibc: `ibctknbridge`, cpuPayer: `cpu.start`, ...(envConfig.eos || {}) };
            case `telos`:
                return { ibc: `ibctknbridge`, cpuPayer: `cpu.start`, ...(envConfig.telos || {}) };
            case `wax`:
                return { ibc: `ibctknbridge`, cpuPayer: `cpu.start`, ...(envConfig.wax || {}) };
            default:
                throw new Error(`No contract accounts for "${network}" network defined yet`);
        }
    }
    else {
        switch (network) {
            case `eos`:
                return { ibc: `ibcbridgedev`, cpuPayer: null, ...(envConfig.eos || {}) };
            case `telos`:
                return { ibc: `ibcbridgedev`, cpuPayer: null, ...(envConfig.telos || {}) };
            case `wax`:
                return { ibc: `ibcbridgedev`, cpuPayer: null, ...(envConfig.wax || {}) };
            default:
                throw new Error(`No contract accounts for "${network}" network defined yet`);
        }
    }
};
const createNetwork = (nodeEndpoint, chainId) => {
    const matches = /^(https?):\/\/(.+?)(:\d+){0,1}$/.exec(nodeEndpoint);
    if (!matches) {
        throw new Error(`Could not parse HTTP endpoint for chain ${chainId}. Needs protocol and port: "${nodeEndpoint}"`);
    }
    const [, httpProtocol, host, portMatch] = matches;
    const portString = portMatch
        ? portMatch.replace(/\D/gi, ``)
        : httpProtocol === `https`
            ? `443`
            : `80`;
    const port = Number.parseInt(portString, 10);
    return {
        chainId,
        protocol: httpProtocol,
        host,
        port,
        nodeEndpoint,
    };
};
/*
- Production networks
    - Telos mainnet : 4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11
    - EOS mainnet : aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906
    - Wax mainnet : 1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4
- Test networks
    - Telos testnet : 1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f
    - Jungle testnet : 2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840
    - Wax testnet : f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12
 */
const EosNetwork = createNetwork(process.env.EOS_ENDPOINT || "https://api.eosn.io:443", "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906");
const TelosNetwork = createNetwork(process.env.TELOS_ENDPOINT || "https://api.telos.africa:443", "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11");
const WaxNetwork = createNetwork(process.env.WAX_ENDPOINT || "https://chain.wax.io:443", "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4");
const EosTestNetwork = createNetwork(process.env.EOSTEST_ENDPOINT || "https://jungle3.cryptolions.io:443", "2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840");
const TelosTestNetwork = createNetwork(process.env.TELOSTEST_ENDPOINT || "https://testnet.telos.africa:443", "1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f");
const WaxTestNetwork = createNetwork(process.env.WAXTEST_ENDPOINT || "https://testnet.waxsweden.org:443", "f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12");
function getNetwork(networkName) {
    if (utils_1.isProduction()) {
        switch (networkName) {
            case "eos":
                return EosNetwork;
            case "telos":
                return TelosNetwork;
            case "wax":
                return WaxNetwork;
            default:
                throw new Error("Network \"" + networkName + "\" not supported yet.");
        }
    }
    else {
        switch (networkName) {
            case "eos":
                return EosTestNetwork;
            case "telos":
                return TelosTestNetwork;
            case "wax":
                return WaxTestNetwork;
            default:
                throw new Error("Network \"" + networkName + "\" not supported yet.");
        }
    }
}
exports.getRpc = (() => {
    const rpcs = {};
    return (networkName) => {
        if (!rpcs[networkName]) {
            rpcs[networkName] = new eosjs_1.JsonRpc(getNetwork(networkName).nodeEndpoint, {
>>>>>>> boid
                fetch: node_fetch_1.default,
            });
        }
        return rpcs[networkName];
    };
})();
//# sourceMappingURL=networks.js.map