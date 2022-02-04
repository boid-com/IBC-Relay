"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogFilePath = exports.logger = void 0;
<<<<<<< HEAD
var path_1 = __importDefault(require("path"));
var winston_1 = require("winston");
var util_1 = require("util");
var utils_1 = require("../utils");
=======
// from https://github.com/winstonjs/winston/issues/1427#issuecomment-535297716
const path_1 = __importDefault(require("path"));
const winston_1 = require("winston");
const util_1 = require("util");
const utils_1 = require("../utils");
>>>>>>> boid
require("winston-daily-rotate-file");
function isPrimitive(val) {
    return val === null || (typeof val !== "object" && typeof val !== "function");
}
function formatWithInspect(val) {
<<<<<<< HEAD
    var prefix = isPrimitive(val) ? "" : "\n";
    var shouldFormat = typeof val !== "string";
    return (prefix + (shouldFormat ? util_1.inspect(val, { depth: null, colors: true }) : val));
}
var rotateFileTransport = new (winston_1.transports.DailyRotateFile)({
    filename: '%DATE%.log',
    dirname: "logs",
    datePattern: 'yyyy-MM-DD',
    utc: true,
    maxFiles: 14,
    level: "silly",
});
var logFilePath = "";
rotateFileTransport.on('new', function (newFilename) {
    logFilePath = newFilename;
    logger.info("Logfile path: " + path_1.default.resolve(logFilePath));
});
var getLogFilePath = function () { return logFilePath; };
exports.getLogFilePath = getLogFilePath;
var logger = winston_1.createLogger({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), 
    // format.colorize(),
    winston_1.format.printf(function (info) {
        var msg = formatWithInspect(info.message);
        var splatArgs = info[Symbol.for("splat")] || [];
        var rest = splatArgs.map(function (data) { return formatWithInspect(data); }).join(" ");
        return info.timestamp + " - " + info.level + ": " + msg + " " + rest;
    })),
    transports: [
        new winston_1.transports.Console({
            level: utils_1.isProduction() ? "info" : "silly"
=======
    const prefix = isPrimitive(val) ? "" : "\n";
    const shouldFormat = typeof val !== "string";
    return (prefix + (shouldFormat ? util_1.inspect(val, { depth: null, colors: true }) : val));
}
const rotateFileTransport = new (winston_1.transports.DailyRotateFile)({
    filename: '%DATE%.log',
    dirname: `logs`,
    datePattern: 'yyyy-MM-DD',
    utc: true,
    maxFiles: 14,
    level: `silly`,
});
let logFilePath = ``;
rotateFileTransport.on('new', function (newFilename) {
    logFilePath = newFilename;
    logger.info(`Logfile path: ${path_1.default.resolve(logFilePath)}`);
});
const getLogFilePath = () => logFilePath;
exports.getLogFilePath = getLogFilePath;
const logger = winston_1.createLogger({
    level: "info",
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), 
    // format.colorize(),
    winston_1.format.printf(info => {
        const msg = formatWithInspect(info.message);
        const splatArgs = info[Symbol.for("splat")] || [];
        const rest = splatArgs.map(data => formatWithInspect(data)).join(" ");
        return `${info.timestamp} - ${info.level}: ${msg} ${rest}`;
    })),
    transports: [
        new winston_1.transports.Console({
            level: utils_1.isProduction() ? `info` : `silly`
>>>>>>> boid
        }),
        // new transports.File({
        //   filename: logFilePath,
        //   level: "silly"
        // }),
        rotateFileTransport,
    ]
});
exports.logger = logger;
<<<<<<< HEAD
logger.info("is_production = " + utils_1.isProduction());
=======
logger.info(`is_production = ${utils_1.isProduction()}`);
>>>>>>> boid
//# sourceMappingURL=index.js.map