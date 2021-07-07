"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const health_1 = require("../utils/health");
class HealthController {
    async version(request, response, next) {
        try {
            return JSON.stringify(health_1.latestHealth);
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = HealthController;
//# sourceMappingURL=HealthController.js.map