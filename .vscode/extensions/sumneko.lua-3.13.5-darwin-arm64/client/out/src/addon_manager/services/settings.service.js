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
exports.revokeAddonSettings = exports.applyAddonSettings = exports.getLibraryPaths = void 0;
const vscode = __importStar(require("vscode"));
const languageserver_1 = require("../../languageserver");
const logging_service_1 = require("./logging.service");
const config_1 = require("../config");
const localLogger = (0, logging_service_1.createChildLogger)("Settings");
/** An error with the user's configuration `.vscode/settings.json` or an
 * addon's `config.json`. */
class ConfigError extends Error {
    constructor(message) {
        super(message);
        localLogger.error(message);
    }
}
const getLibraryPaths = async () => {
    const result = [];
    if (!vscode.workspace.workspaceFolders)
        return [];
    for (const folder of vscode.workspace.workspaceFolders) {
        const libraries = await (0, languageserver_1.getConfig)(config_1.LIBRARY_SETTING, folder.uri);
        result.push({ folder, paths: libraries });
    }
    return result;
};
exports.getLibraryPaths = getLibraryPaths;
const applyAddonSettings = async (folder, config) => {
    if (!folder)
        throw new ConfigError(`Workspace is not open!`);
    const changes = [];
    for (const [newKey, newValue] of Object.entries(config)) {
        if (Array.isArray(newValue)) {
            newValue.forEach((val) => {
                changes.push({
                    action: "add",
                    key: newKey,
                    value: val,
                    uri: folder.uri,
                });
            });
        }
        else if (typeof newValue === "object" && newValue !== null) {
            changes.push(...Object.entries(newValue).map(([key, value]) => {
                return {
                    action: "prop",
                    key: newKey,
                    prop: key,
                    value,
                    uri: folder.uri,
                };
            }));
        }
        else {
            changes.push({
                action: "set",
                key: newKey,
                value: newValue,
                uri: folder.uri,
            });
        }
    }
    return await (0, languageserver_1.setConfig)(changes);
};
exports.applyAddonSettings = applyAddonSettings;
const revokeAddonSettings = async (folder, config) => {
    if (!folder)
        throw new ConfigError(`Workspace is not open!`);
    const changes = [];
    for (const [newKey, newValue] of Object.entries(config)) {
        const currentValue = await (0, languageserver_1.getConfig)(newKey, folder.uri);
        if (Array.isArray(newValue)) {
            // Only keep values that the addon settings does not contain
            const notAddon = currentValue.filter((oldValue) => !newValue.includes(oldValue));
            changes.push({
                action: "set",
                key: newKey,
                value: notAddon,
                uri: folder.uri,
            });
        }
        else if (typeof newValue === "object" && newValue !== null) {
            for (const objectKey of Object.keys(newValue)) {
                delete currentValue[objectKey];
            }
            // If object is now empty, delete it
            if (Object.keys(currentValue).length === 0) {
                changes.push({
                    action: "set",
                    key: newKey,
                    value: undefined,
                    uri: folder.uri,
                });
            }
            else {
                changes.push({
                    action: "set",
                    key: newKey,
                    value: currentValue,
                    uri: folder.uri,
                });
            }
        }
    }
    return await (0, languageserver_1.setConfig)(changes);
};
exports.revokeAddonSettings = revokeAddonSettings;
//# sourceMappingURL=settings.service.js.map