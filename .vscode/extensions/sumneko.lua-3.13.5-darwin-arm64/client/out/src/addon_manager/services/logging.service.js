"use strict";
/**
 * Logging using WintonJS
 * https://github.com/winstonjs/winston
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChildLogger = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const vsCodeOutputTransport_1 = __importDefault(require("./logging/vsCodeOutputTransport"));
const axios_1 = __importDefault(require("axios"));
const string_service_1 = require("./string.service");
const vscode = __importStar(require("vscode"));
const triple_beam_1 = require("triple-beam");
const config_1 = require("../config");
const vsCodeLogFileTransport_1 = __importDefault(require("./logging/vsCodeLogFileTransport"));
// Create logger from winston
exports.logger = winston_1.default.createLogger({
    level: "info",
    defaultMeta: { category: "General", report: true },
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.printf((message) => {
        const level = (0, string_service_1.padText)(message.level, 9);
        const category = (0, string_service_1.padText)(message?.defaultMeta?.category ?? "GENERAL", 18);
        if (typeof message.message === "object")
            return `[${message.timestamp}] | ${level.toUpperCase()} | ${category} | ${JSON.stringify(message.message)}`;
        return `[${message.timestamp}] | ${level.toUpperCase()} | ${category} | ${message.message}`;
    })),
    transports: [new vsCodeOutputTransport_1.default({ level: "info" })],
});
// When a error is logged, ask user to report error.
exports.logger.on("data", async (info) => {
    if (info.level !== "error" || !info.report)
        return;
    const choice = await vscode.window.showErrorMessage(`An error occurred with the Lua Addon Manager. Please help us improve by reporting the issue ❤️`, { modal: false }, "Report Issue");
    if (choice !== "Report Issue")
        return;
    // Open log file
    await vscode.env.openExternal(vsCodeLogFileTransport_1.default.currentLogFile);
    // Read log file and copy to clipboard
    const log = await vscode.workspace.fs.readFile(vsCodeLogFileTransport_1.default.currentLogFile);
    await vscode.env.clipboard.writeText("<details><summary>Retrieved Log</summary>\n\n```\n" +
        log.toString() +
        "\n```\n\n</details>");
    vscode.window.showInformationMessage("Copied log to clipboard");
    // After a delay, open GitHub issues page
    setTimeout(() => {
        const base = vscode.Uri.parse(config_1.REPOSITORY_ISSUES_URL);
        const query = [
            base.query,
            `actual=...\n\nI also see the following error:\n\n\`\`\`\n${info[triple_beam_1.MESSAGE]}\n\`\`\``,
        ];
        const issueURI = base.with({ query: query.join("&") });
        vscode.env.openExternal(issueURI);
    }, 2000);
});
/** Helper that creates a child logger from the main logger. */
const createChildLogger = (label) => {
    return exports.logger.child({
        level: "info",
        defaultMeta: { category: label },
        format: winston_1.default.format.combine(winston_1.default.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    });
};
exports.createChildLogger = createChildLogger;
// Log HTTP requests made through axios
const axiosLogger = (0, exports.createChildLogger)("AXIOS");
axios_1.default.interceptors.request.use((request) => {
    const method = request.method ?? "???";
    axiosLogger.debug(`${method.toUpperCase()} requesting ${request.url}`);
    return request;
}, (error) => {
    const url = error?.config?.url;
    const method = error.config?.method?.toUpperCase();
    axiosLogger.error(`${url} ${method} ${error.code} ${error.message}`);
    return Promise.reject(error);
});
//# sourceMappingURL=logging.service.js.map