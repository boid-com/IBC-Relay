"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApi = void 0;
<<<<<<< HEAD
var eosjs_1 = require("eosjs");
var eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
var util_1 = require("util");
var networks_1 = require("./networks");
var dotenv_1 = require("../dotenv");
var utils_1 = require("../utils");
exports.getApi = (function () {
    var apis = {};
    return function (networkName) {
        var _networkName = utils_1.unmapNetworkName(networkName);
        if (!apis[_networkName]) {
            var envConfig = dotenv_1.getEnvConfig();
            if (!envConfig[_networkName])
                throw new Error("Environment variables not loaded for: " + _networkName);
            var signatureProvider = new eosjs_jssig_1.JsSignatureProvider([
                envConfig[_networkName].reporterKey,
                envConfig[_networkName].cpuKey,
            ].filter(Boolean));
            apis[_networkName] = new eosjs_1.Api({
                rpc: networks_1.getRpc(networkName),
                signatureProvider: signatureProvider,
=======
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
>>>>>>> boid
                textDecoder: new util_1.TextDecoder(),
                textEncoder: new util_1.TextEncoder(),
            });
        }
<<<<<<< HEAD
        return apis[_networkName];
=======
        return apis[networkName];
>>>>>>> boid
    };
})();
//# sourceMappingURL=api.js.map