"use strict";
<<<<<<< HEAD
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
exports.PromiseAllSettledFilterFulfilled = exports.PromiseAllSettled = exports.sleep = void 0;
exports.sleep = function (time, throwError) {
    if (time === void 0) { time = 0; }
    if (throwError === void 0) { throwError = false; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
=======
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromiseAllSettledFilterFulfilled = exports.PromiseAllSettled = exports.sleep = void 0;
exports.sleep = (time = 0, throwError = false) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
>>>>>>> boid
            if (throwError) {
                reject();
            }
            else {
                resolve();
            }
        }, time);
    });
};
// polyfill for https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled
<<<<<<< HEAD
exports.PromiseAllSettled = function (promises) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, Promise.all(promises.map(function (p) {
                return p.then(function (v) {
                    return { status: 'fulfilled', value: v };
                }, function (error) {
                    return { status: 'rejected', reason: error };
                });
            }))];
    });
}); };
exports.PromiseAllSettledFilterFulfilled = function (promises) { return __awaiter(void 0, void 0, void 0, function () {
    var results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.PromiseAllSettled(promises)];
            case 1:
                results = _a.sent();
                return [2 /*return*/, results
                        .filter(function (r) { return r.status === "fulfilled"; })
                        .map(function (r) { return r.value; })];
        }
    });
}); };
=======
exports.PromiseAllSettled = async (promises) => {
    return Promise.all(promises.map(p => p.then(v => {
        return { status: 'fulfilled', value: v };
    }, error => {
        return { status: 'rejected', reason: error };
    })));
};
exports.PromiseAllSettledFilterFulfilled = async (promises) => {
    const results = await exports.PromiseAllSettled(promises);
    return results
        .filter(r => r.status === `fulfilled`)
        .map(r => r.value);
};
>>>>>>> boid
//# sourceMappingURL=promise.js.map