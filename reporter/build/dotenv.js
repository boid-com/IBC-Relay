"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetworksToWatch = exports.getEnvConfig = void 0;
const dotenv = __importStar(require("dotenv"));
const utils_1 = require("./utils");
const result = dotenv.config();
if (result.error) {
    console.log('error');
    throw result.error;
}
exports.getEnvConfig = () => {
    const parse = (networkName) => {
        const VAR_NAME = utils_1.isProduction() ? `${networkName.toUpperCase()}_IBC` : `${networkName.toUpperCase()}TEST_IBC`;
        const val = process.env[VAR_NAME];
        if (!val)
            return;
        const [acc, permission, key, cpuPayer, cpuKey] = val.split(`;`).map((x) => x.trim());
        return {
            reporterAccount: acc,
            reporterPermission: permission,
            reporterKey: key,
            cpuPayer,
            cpuKey,
        };
    };
    return utils_1.ALL_NETWORKS.reduce((acc, network) => ({
        ...acc,
        [network]: parse(network),
    }), {});
};
// Move NETWORKS_TO_WATCH to alow it to be set in the .env file
exports.getNetworksToWatch = () => {
    const val = process.env[`NETWORKS_TO_WATCH`];
    if (!val) {
        return utils_1.ALL_NETWORKS;
    }
    else {
        return (val.split(`,`).map((x) => x.trim()) || utils_1.ALL_NETWORKS);
    }
};
//# sourceMappingURL=dotenv.js.map