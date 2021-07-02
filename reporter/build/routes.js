"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
var HealthController_1 = __importDefault(require("./controller/HealthController"));
var LogController_1 = __importDefault(require("./controller/LogController"));
exports.Routes = [
    {
        method: "get",
        route: "/health",
        controller: HealthController_1.default,
        action: "version"
    },
    {
        method: "get",
        route: "/logs",
        controller: LogController_1.default,
        action: "logs"
    },
];
//# sourceMappingURL=routes.js.map