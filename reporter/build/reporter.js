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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("./eos/fetch");
var networks_1 = require("./eos/networks");
var logger_1 = require("./logger");
var types_1 = require("./types");
var utils_1 = require("./utils");
var health_1 = require("./utils/health");
var Reporter = /** @class */ (function () {
    function Reporter(networkName) {
        this.transfers = [];
        this.transferIrreversibilityMap = {};
        this.reports = [];
        this.currentHeadBlock = Infinity;
        this.currentHeadTime = new Date().toISOString();
        this.currentIrreversibleHeadBlock = Infinity;
        this.network = networkName;
    }
    Reporter.prototype.log = function (level) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var firstArg = args[0], otherArgs = args.slice(1);
        logger_1.logger.log.apply(logger_1.logger, __spreadArrays([level, "Reporter " + this.network + ": " + firstArg], otherArgs));
    };
    Reporter.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.log("info", "started");
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 10];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 6, 7, 9]);
                        return [4 /*yield*/, Promise.all([
                                this.fetchTransfers(),
                                this.fetchXReports(),
                                this.fetchHeadBlockNumbers(),
                            ])];
                    case 3:
                        _a.sent();
                        this.printState();
                        health_1.pulse(this.network, this.currentHeadBlock, this.currentHeadTime);
                        return [4 /*yield*/, this.reportTransfers()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.executeReports()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        error_1 = _a.sent();
                        this.log("error", utils_1.extractRpcError(error_1));
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, utils_1.sleep(10000)];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    Reporter.prototype.fetchTransfers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var contracts, transfers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        contracts = networks_1.getContractsForNetwork(this.network);
                        return [4 /*yield*/, fetch_1.fetchAllRows(this.network)({
                                code: contracts.ibc,
                                scope: contracts.ibc,
                                table: "transfers",
                                lower_bound: Math.floor(Date.now() / 1e3),
                                index_position: "2",
                                key_type: "i64",
                            })];
                    case 1:
                        transfers = _a.sent();
                        this.transfers = transfers.map(function (t) { return (__assign(__assign({}, t), { id: Number.parseInt("" + t.id, 10), is_refund: Boolean(t.is_refund), 
                            // do not overwrite original transaction_time and expires_at
                            // if a Date object is serialized back using eosjs, it will _not_ equal
                            // the original strings because of time zones
                            // new Date(Date.parse(a + 'Z')) https://github.com/EOSIO/eosjs/blob/master/src/eosjs-serialize.ts#L540
                            // they should do: new Date(Date.parse(a.toISOString()))
                            transactionDate: new Date(t.transaction_time + "Z"), expiresAtDate: new Date(t.expires_at + "Z") })); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Reporter.prototype.fetchXReports = function () {
        return __awaiter(this, void 0, void 0, function () {
            var xChainNetwork, contracts, reports;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xChainNetwork = this.xChainNetwork;
                        contracts = networks_1.getContractsForNetwork(xChainNetwork);
                        return [4 /*yield*/, fetch_1.fetchAllRows(xChainNetwork)({
                                code: contracts.ibc,
                                scope: contracts.ibc,
                                table: "reports",
                                lower_bound: Math.floor(Date.now() / 1e3),
                                index_position: "3",
                                key_type: "i64",
                            })];
                    case 1:
                        reports = _a.sent();
                        this.reports = reports.map(function (r) { return (__assign(__assign({}, r), { id: Number.parseInt("" + r.id, 10) })); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Reporter.prototype.fetchHeadBlockNumbers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, headBlockNumber, headBlockTime, lastIrreversibleBlockNumber;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch_1.fetchHeadBlockNumbers(this.network)()];
                    case 1:
                        _a = _b.sent(), headBlockNumber = _a.headBlockNumber, headBlockTime = _a.headBlockTime, lastIrreversibleBlockNumber = _a.lastIrreversibleBlockNumber;
                        this.currentHeadBlock = headBlockNumber;
                        this.currentIrreversibleHeadBlock = lastIrreversibleBlockNumber;
                        this.currentHeadTime = headBlockTime;
                        return [2 /*return*/];
                }
            });
        });
    };
    Reporter.prototype.reportTransfers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var unreportedTransfers, irreversibleUnreportedTransfers, transferToProcess, toBlockchain, xcontracts, tx, error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        unreportedTransfers = this.transfers.filter(function (t) {
                            var isExpired = Date.now() > t.expiresAtDate.getTime();
                            if (isExpired)
                                return false;
                            if (!types_1.isNetworkName(t.to_blockchain))
                                throw new Error("Unknwon blockchain in transfer with id " + t.id + ": " + t.to_blockchain);
                            var xcontracts = networks_1.getContractsForNetwork(t.to_blockchain);
                            var alreadyReported = _this.reports.some(function (r) {
                                return (r.transfer.id === t.id &&
                                    r.transfer.from_blockchain === t.from_blockchain &&
                                    r.transfer.transaction_id === t.transaction_id &&
                                    r.confirmed_by.includes(xcontracts.reporterAccount));
                            });
                            return !alreadyReported;
                        });
                        if (unreportedTransfers.length === 0)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.filterTransfersByIrreversibility(unreportedTransfers)];
                    case 1:
                        irreversibleUnreportedTransfers = _a.sent();
                        if (irreversibleUnreportedTransfers.length === 0)
                            return [2 /*return*/];
                        transferToProcess = utils_1.pickRandom(irreversibleUnreportedTransfers);
                        toBlockchain = transferToProcess.to_blockchain;
                        if (!types_1.isNetworkName(toBlockchain))
                            throw new Error("Unknwon blockchain in transfer with id " + transferToProcess.id + ": " + toBlockchain);
                        xcontracts = networks_1.getContractsForNetwork(toBlockchain);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetch_1.sendTransaction(toBlockchain)({
                                account: xcontracts.ibc,
                                name: "report",
                                authorization: [
                                    {
                                        actor: xcontracts.reporterAccount,
                                        permission: xcontracts.reporterPermission,
                                    },
                                ],
                                data: {
                                    reporter: xcontracts.reporterAccount,
                                    transfer: transferToProcess,
                                },
                            })];
                    case 3:
                        tx = _a.sent();
                        this.log("info", "Reported transfer with id " + this.getInternalUniqueTransferId(transferToProcess) + ": " + utils_1.formatBloksTransaction(toBlockchain, tx.transaction_id));
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        // const errorMessage = extractRpcError(error)
                        throw error_2;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Reporter.prototype.executeReports = function () {
        return __awaiter(this, void 0, void 0, function () {
            var reportsToExecute, reportToExecute, toBlockchain, xcontracts, executionFailed, tx_1, error_3, errorMessage, tx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        reportsToExecute = this.reports.filter(function (r) {
                            var reporterName = networks_1.getContractsForNetwork(r.transfer.to_blockchain).reporterAccount;
                            return (r.confirmed &&
                                !r.executed &&
                                !r.failed &&
                                !r.failed_by.includes(reporterName));
                        });
                        if (reportsToExecute.length === 0)
                            return [2 /*return*/];
                        reportToExecute = utils_1.pickRandom(reportsToExecute);
                        toBlockchain = reportToExecute.transfer.to_blockchain;
                        if (!types_1.isNetworkName(toBlockchain))
                            throw new Error("Unknwon blockchain in reported transfer with id " + reportToExecute.id + ": " + toBlockchain);
                        xcontracts = networks_1.getContractsForNetwork(toBlockchain);
                        executionFailed = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch_1.sendTransaction(toBlockchain)({
                                account: xcontracts.ibc,
                                name: "exec",
                                authorization: [
                                    {
                                        actor: xcontracts.reporterAccount,
                                        permission: xcontracts.reporterPermission,
                                    },
                                ],
                                data: {
                                    reporter: xcontracts.reporterAccount,
                                    report_id: reportToExecute.id,
                                },
                            })];
                    case 2:
                        tx_1 = _a.sent();
                        this.log("info", "Executed report-id " + reportToExecute.id + " (transfer " + this.getInternalUniqueTransferId(reportToExecute.transfer) + "): " + utils_1.formatBloksTransaction(toBlockchain, tx_1.transaction_id));
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        errorMessage = utils_1.extractRpcError(error_3);
                        this.log("error", "Could not execute report-id " + reportToExecute.id + " (transfer " + this.getInternalUniqueTransferId(reportToExecute.transfer) + "): " + errorMessage);
                        executionFailed = true;
                        return [3 /*break*/, 4];
                    case 4:
                        if (!executionFailed)
                            return [2 /*return*/];
                        return [4 /*yield*/, fetch_1.sendTransaction(toBlockchain)({
                                account: xcontracts.ibc,
                                name: "execfailed",
                                authorization: [
                                    {
                                        actor: xcontracts.reporterAccount,
                                        permission: xcontracts.reporterPermission,
                                    },
                                ],
                                data: {
                                    reporter: xcontracts.reporterAccount,
                                    report_id: reportToExecute.id,
                                },
                            })];
                    case 5:
                        tx = _a.sent();
                        this.log("info", "Reported failed execution for " + reportToExecute.id + ": " + utils_1.formatBloksTransaction(toBlockchain, tx.transaction_id));
                        return [2 /*return*/];
                }
            });
        });
    };
    Reporter.prototype.filterTransfersByIrreversibility = function (transfers) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                // because rpc.history_get_transaction is deprecated, there's no way for us to get the exact block number of when the transaction was included
                // but when we see it in RAM, the current head block is definitely past it
                transfers.forEach(function (t) {
                    var tId = _this.getInternalUniqueTransferId(t);
                    if (!_this.transferIrreversibilityMap[tId]) {
                        var txInfo = t.from_account + "@" + t.from_blockchain + " == " + t.quantity + " ==> " + t.to_account + "@" + t.to_blockchain;
                        _this.log("info", "Saw new transfer " + tId + " at block " + _this.currentHeadBlock + "\n" + txInfo + "\nWaiting for irreversibility");
                        // saw at headblock, wait until this block becomes irreversible
                        _this.transferIrreversibilityMap[tId] = _this.currentHeadBlock;
                    }
                });
                return [2 /*return*/, transfers.filter(function (t) {
                        return _this.currentIrreversibleHeadBlock >
                            (_this.transferIrreversibilityMap[_this.getInternalUniqueTransferId(t)] ||
                                Infinity);
                    })];
            });
        });
    };
    Reporter.prototype.getInternalUniqueTransferId = function (transfer) {
        return transfer.from_blockchain + "|" + transfer.id + "|" + transfer.transaction_id;
    };
    Object.defineProperty(Reporter.prototype, "xChainNetwork", {
        get: function () {
            switch (this.network) {
                case "eos":
                    return "telos";
                case "telos":
                    return "eos";
                default: {
                    throw new Error("xChainNetwork: Unknown current network " + this.network);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Reporter.prototype.printState = function () {
        // this.log(`verbose`, `tranfers:`, this.transfers);
        // this.log(`verbose`, `reports:`, this.reports);
        // this.log(
        //   `verbose`,
        //   `headBlock: ${this.currentHeadBlock} irreversible: ${this.currentIrreversibleHeadBlock}`
        // );
    };
    return Reporter;
}());
exports.default = Reporter;
//# sourceMappingURL=reporter.js.map