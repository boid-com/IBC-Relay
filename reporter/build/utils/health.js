"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pulse = exports.latestHealth = void 0;
exports.latestHealth = {};
exports.pulse = (network, headBlock, headTime) => {
    exports.latestHealth[network] = { block: headBlock, time: `${headTime}Z` };
};
//# sourceMappingURL=health.js.map