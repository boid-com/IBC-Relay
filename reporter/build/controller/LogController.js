"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const logger_1 = require("../logger");
class LogsController {
    async logs(req, res, next) {
        try {
            const logs = fs_1.readFileSync(logger_1.getLogFilePath(), `utf8`);
            return `<pre>${logs}</pre>`;
        }
        catch (err) {
            next(err);
        }
    }
}
exports.default = LogsController;
//# sourceMappingURL=LogController.js.map