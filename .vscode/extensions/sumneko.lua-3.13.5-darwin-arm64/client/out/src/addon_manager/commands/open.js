"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __importStar(require("vscode"));
const logging_service_1 = require("../services/logging.service");
const config_1 = require("../config");
const localLogger = (0, logging_service_1.createChildLogger)("Open Addon");
exports.default = async (context, message) => {
    const extensionStorageURI = (0, config_1.getStorageUri)(context);
    const uri = vscode.Uri.joinPath(extensionStorageURI, "addonManager", config_1.ADDONS_DIRECTORY, message.data.name);
    localLogger.info(`Opening "${message.data.name}" addon in file explorer`);
    vscode.env.openExternal(vscode.Uri.file(uri.fsPath));
};
//# sourceMappingURL=open.js.map