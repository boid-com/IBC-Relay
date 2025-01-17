"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exhaustiveCheck = exports.isNetworkName = void 0;
function isNetworkName(networkName) {
    switch (networkName) {
        case `eos`:
            return true;
        case `telos`:
            return true;
        case `wax`:
            return true;
    }
    return false;
}
exports.isNetworkName = isNetworkName;
function exhaustiveCheck(x) {
    throw new Error("exhaustiveCheck: should not reach here");
}
exports.exhaustiveCheck = exhaustiveCheck;
//# sourceMappingURL=types.js.map