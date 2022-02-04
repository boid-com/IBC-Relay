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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = exports.fetchHeadBlockNumbers = exports.fetchAllScopes = exports.fetchAllRows = exports.fetchRows = void 0;
var api_1 = require("./api");
var networks_1 = require("./networks");
var dotenv_1 = require("../dotenv");
var utils_1 = require("../utils");
var MAX_PAGINATION_FETCHES = 20;
exports.fetchRows = function (network) { return function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var rpc, mergedOptions, lowerBound, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rpc = networks_1.getRpc(network);
                mergedOptions = __assign({ json: true, lower_bound: undefined, upper_bound: undefined, limit: 9999 }, options);
                lowerBound = mergedOptions.lower_bound;
                return [4 /*yield*/, rpc.get_table_rows(__assign(__assign({}, mergedOptions), { lower_bound: lowerBound }))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.rows];
        }
    });
}); }; };
// work around the limit bug in nodeos due to max timeout
// https://github.com/EOSIO/eos/issues/3965
exports.fetchAllRows = function (network) { return function (options, indexName) {
    if (indexName === void 0) { indexName = "id"; }
    return __awaiter(void 0, void 0, void 0, function () {
        var rpc, mergedOptions, rows, lowerBound, i, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rpc = networks_1.getRpc(network);
                    mergedOptions = __assign({ json: true, lower_bound: 0, upper_bound: undefined, limit: 9999 }, options);
                    rows = [];
                    lowerBound = mergedOptions.lower_bound;
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < MAX_PAGINATION_FETCHES)) return [3 /*break*/, 4];
                    return [4 /*yield*/, rpc.get_table_rows(__assign(__assign({}, mergedOptions), { lower_bound: lowerBound }))];
                case 2:
                    result = _a.sent();
                    rows = rows.concat(result.rows);
                    if (!result.more || result.rows.length === 0)
                        return [3 /*break*/, 4];
                    // EOS 2.0 api
                    if (typeof result.next_key !== "undefined") {
                        lowerBound = result.next_key;
                    }
                    else {
                        lowerBound =
                            Number.parseInt("" + result.rows[result.rows.length - 1][indexName], 10) + 1;
                    }
                    _a.label = 3;
                case 3:
                    i += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, rows];
            }
        });
    });
}; };
exports.fetchAllScopes = function (network) { return function (contract, table) { return __awaiter(void 0, void 0, void 0, function () {
    var rpc, mergedOptions, rows;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rpc = networks_1.getRpc(network);
                mergedOptions = {
                    json: true,
                    lower_bound: undefined,
                    upper_bound: undefined,
                    limit: 9999,
                    code: contract,
                    table: table,
                };
                return [4 /*yield*/, rpc.get_table_by_scope(mergedOptions)];
            case 1:
                rows = (_a.sent())
                    .rows;
                return [2 /*return*/, rows.map(function (row) { return row.scope; })];
        }
    });
}); }; };
exports.fetchHeadBlockNumbers = function (network) { return function () { return __awaiter(void 0, void 0, void 0, function () {
    var rpc, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rpc = networks_1.getRpc(network);
                return [4 /*yield*/, rpc.get_info()];
            case 1:
                response = _a.sent();
                return [2 /*return*/, {
                        headBlockTime: response.head_block_time,
                        headBlockNumber: response.head_block_num,
                        lastIrreversibleBlockNumber: response.last_irreversible_block_num,
                    }];
        }
    });
}); }; };
exports.sendTransaction = function (network) { return function (actions) { return __awaiter(void 0, void 0, void 0, function () {
    var _actions, txOptions, eosApi, config;
    return __generator(this, function (_a) {
        _actions = Array.isArray(actions) ? actions : [actions];
        txOptions = {
            broadcast: true,
            sign: true,
            blocksBehind: 3,
            expireSeconds: 60 * 5,
        };
        eosApi = api_1.getApi(network);
        config = dotenv_1.getEnvConfig()[utils_1.unmapNetworkName(network)];
        if (config.cpuPayer) {
            _actions.unshift({
                account: config.cpuPayer,
                name: "payforcpu",
                authorization: [
                    {
                        actor: config.cpuPayer,
                        permission: "payforcpu",
                    },
                ],
                data: {},
            });
        }
        return [2 /*return*/, eosApi.transact({
                actions: _actions,
            }, txOptions)];
    });
}); }; };
=======
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransaction = exports.fetchHeadBlockNumbers = exports.fetchAllScopes = exports.fetchAllRows = exports.fetchRows = void 0;
const api_1 = require("./api");
const networks_1 = require("./networks");
const dotenv_1 = require("../dotenv");
const MAX_PAGINATION_FETCHES = 20;
exports.fetchRows = (network) => async (options) => {
    const rpc = networks_1.getRpc(network);
    const mergedOptions = {
        json: true,
        lower_bound: undefined,
        upper_bound: undefined,
        limit: 9999,
        ...options,
    };
    let lowerBound = mergedOptions.lower_bound;
    const result = await rpc.get_table_rows({
        ...mergedOptions,
        lower_bound: lowerBound,
    });
    return result.rows;
};
// work around the limit bug in nodeos due to max timeout
// https://github.com/EOSIO/eos/issues/3965
exports.fetchAllRows = (network) => async (options, indexName = `id`) => {
    const rpc = networks_1.getRpc(network);
    const mergedOptions = {
        json: true,
        lower_bound: 0,
        upper_bound: undefined,
        limit: 9999,
        ...options,
    };
    let rows = [];
    let lowerBound = mergedOptions.lower_bound;
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < MAX_PAGINATION_FETCHES; i += 1) {
        const result = await rpc.get_table_rows({
            ...mergedOptions,
            lower_bound: lowerBound,
        });
        rows = rows.concat(result.rows);
        if (!result.more || result.rows.length === 0)
            break;
        // EOS 2.0 api
        if (typeof result.next_key !== `undefined`) {
            lowerBound = result.next_key;
        }
        else {
            lowerBound =
                Number.parseInt(`${result.rows[result.rows.length - 1][indexName]}`, 10) + 1;
        }
    }
    return rows;
};
exports.fetchAllScopes = (network) => async (contract, table) => {
    const rpc = networks_1.getRpc(network);
    const mergedOptions = {
        json: true,
        lower_bound: undefined,
        upper_bound: undefined,
        limit: 9999,
        code: contract,
        table,
    };
    const rows = (await rpc.get_table_by_scope(mergedOptions))
        .rows;
    return rows.map((row) => row.scope);
};
exports.fetchHeadBlockNumbers = (network) => async () => {
    const rpc = networks_1.getRpc(network);
    const response = await rpc.get_info();
    return {
        headBlockTime: response.head_block_time,
        headBlockNumber: response.head_block_num,
        lastIrreversibleBlockNumber: response.last_irreversible_block_num,
    };
};
exports.sendTransaction = (network) => async (actions) => {
    let _actions = Array.isArray(actions) ? actions : [actions];
    const txOptions = {
        broadcast: true,
        sign: true,
        blocksBehind: 3,
        expireSeconds: 60 * 5,
    };
    const eosApi = api_1.getApi(network);
    const config = dotenv_1.getEnvConfig()[network];
    if (config.cpuPayer) {
        _actions.unshift({
            account: config.cpuPayer,
            name: `payforcpu`,
            authorization: [
                {
                    actor: config.cpuPayer,
                    permission: `payforcpu`,
                },
            ],
            data: {},
        });
    }
    return eosApi.transact({
        actions: _actions,
    }, txOptions);
};
>>>>>>> boid
//# sourceMappingURL=fetch.js.map