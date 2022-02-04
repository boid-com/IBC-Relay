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
<<<<<<< HEAD
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
=======
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
>>>>>>> boid
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
<<<<<<< HEAD
exports.getEnvConfig = void 0;
var dotenv = __importStar(require("dotenv"));
var utils_1 = require("./utils");
var result = dotenv.config();
=======
exports.getNetworksToWatch = exports.getEnvConfig = void 0;
const dotenv = __importStar(require("dotenv"));
const utils_1 = require("./utils");
const result = dotenv.config();
>>>>>>> boid
if (result.error) {
    console.log('error');
    throw result.error;
}
<<<<<<< HEAD
exports.getEnvConfig = function () {
    var parse = function (networkName) {
        var VAR_NAME = networkName.toUpperCase() + "_IBC";
        var val = process.env[VAR_NAME];
        if (!val)
            return;
        var _a = val.split(";").map(function (x) { return x.trim(); }), acc = _a[0], permission = _a[1], key = _a[2], cpuPayer = _a[3], cpuKey = _a[4];
=======
exports.getEnvConfig = () => {
    const parse = (networkName) => {
        const VAR_NAME = utils_1.isProduction() ? `${networkName.toUpperCase()}_IBC` : `${networkName.toUpperCase()}TEST_IBC`;
        const val = process.env[VAR_NAME];
        if (!val)
            return;
        const [acc, permission, key, cpuPayer, cpuKey] = val.split(`;`).map((x) => x.trim());
>>>>>>> boid
        return {
            reporterAccount: acc,
            reporterPermission: permission,
            reporterKey: key,
<<<<<<< HEAD
            cpuPayer: cpuPayer,
            cpuKey: cpuKey,
        };
    };
    return utils_1.ALL_NETWORKS.reduce(function (acc, network) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[network] = parse(network), _a)));
    }, {});
=======
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
>>>>>>> boid
};
//# sourceMappingURL=dotenv.js.map