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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGit = exports.git = void 0;
const vscode = __importStar(require("vscode"));
const simple_git_1 = __importDefault(require("simple-git"));
const filesystem_service_1 = __importDefault(require("./filesystem.service"));
const logging_service_1 = require("./logging.service");
const config_1 = require("../config");
const localLogger = (0, logging_service_1.createChildLogger)("Git");
exports.git = (0, simple_git_1.default)({ trimmed: true });
const setupGit = async (context) => {
    const storageURI = vscode.Uri.joinPath((0, config_1.getStorageUri)(context), "addonManager");
    await filesystem_service_1.default.createDirectory(storageURI);
    // set working directory
    await exports.git.cwd({ path: storageURI.fsPath, root: true });
    // clone if not already cloned
    if (await filesystem_service_1.default.empty(storageURI)) {
        try {
            localLogger.debug(`Attempting to clone ${config_1.REPOSITORY_NAME} to ${storageURI.fsPath}`);
            await exports.git.clone(config_1.REPOSITORY.PATH, storageURI.fsPath);
            localLogger.debug(`Cloned ${config_1.REPOSITORY_NAME} to ${storageURI.fsPath}`);
        }
        catch (e) {
            localLogger.warn(`Failed to clone ${config_1.REPOSITORY_NAME} to ${storageURI.fsPath}!`);
            throw e;
        }
    }
    // pull
    try {
        await exports.git.fetch();
        await exports.git.pull();
        await exports.git.checkout(config_1.REPOSITORY.DEFAULT_BRANCH);
    }
    catch (e) {
        localLogger.warn(`Failed to pull ${config_1.REPOSITORY_NAME}!`);
        throw e;
    }
};
exports.setupGit = setupGit;
//# sourceMappingURL=git.service.js.map