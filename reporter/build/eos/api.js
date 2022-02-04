"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApi = void 0;
const eosjs_1 = require("eosjs");
const eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
const util_1 = require("util");
const networks_1 = require("./networks");
const dotenv_1 = require("../dotenv");
exports.getApi = (() => {
    const apis = {};
    return (networkName) => {
        if (!apis[networkName]) {
            const envConfig = dotenv_1.getEnvConfig();
            if (!envConfig[networkName])
                throw new Error(`Environment variables not loaded for: ${networkName}`);
            const signatureProvider = new eosjs_jssig_1.JsSignatureProvider([
                envConfig[networkName].reporterKey,
                envConfig[networkName].cpuKey,
            ].filter(Boolean));
            apis[networkName] = new eosjs_1.Api({
                rpc: networks_1.getRpc(networkName),
                signatureProvider,
                textDecoder: new util_1.TextDecoder(),
                textEncoder: new util_1.TextEncoder(),
            });
        }
        return apis[networkName];
    };
})();
//# sourceMappingURL=api.js.map