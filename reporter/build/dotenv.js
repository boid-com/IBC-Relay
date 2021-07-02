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
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvConfig = void 0;
var dotenv = __importStar(require("dotenv"));
var utils_1 = require("./utils");
var result = dotenv.config();
if (result.error) {
    console.log('error');
    throw result.error;
}
exports.getEnvConfig = function () {
    var parse = function (networkName) {
        var VAR_NAME = networkName.toUpperCase() + "_IBC";
        var val = process.env[VAR_NAME];
        if (!val)
            return;
        var _a = val.split(";").map(function (x) { return x.trim(); }), acc = _a[0], permission = _a[1], key = _a[2], cpuPayer = _a[3], cpuKey = _a[4];
        return {
            reporterAccount: acc,
            reporterPermission: permission,
            reporterKey: key,
            cpuPayer: cpuPayer,
            cpuKey: cpuKey,
        };
    };
    return utils_1.ALL_NETWORKS.reduce(function (acc, network) {
        var _a;
        return (__assign(__assign({}, acc), (_a = {}, _a[network] = parse(network), _a)));
    }, {});
};
//# sourceMappingURL=dotenv.js.map