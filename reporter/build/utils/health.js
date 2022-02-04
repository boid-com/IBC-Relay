"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pulse = exports.latestHealth = void 0;
exports.latestHealth = {};
<<<<<<< HEAD
exports.pulse = function (network, headBlock, headTime) {
    exports.latestHealth[network] = { block: headBlock, time: headTime + "Z" };
=======
exports.pulse = (network, headBlock, headTime) => {
    exports.latestHealth[network] = { block: headBlock, time: `${headTime}Z` };
>>>>>>> boid
};
//# sourceMappingURL=health.js.map