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
exports.activate = activate;
exports.deactivate = deactivate;
const languageserver = __importStar(require("./languageserver"));
const psi = __importStar(require("./psi/psiViewer"));
const addonManager = __importStar(require("./addon_manager/registration"));
const extension_js_1 = __importDefault(require("../3rd/vscode-lua-doc/extension.js"));
function activate(context) {
    languageserver.activate(context);
    const luaDocContext = {
        asAbsolutePath: context.asAbsolutePath,
        environmentVariableCollection: context.environmentVariableCollection,
        extensionUri: context.extensionUri,
        globalState: context.globalState,
        storagePath: context.storagePath,
        subscriptions: context.subscriptions,
        workspaceState: context.workspaceState,
        extensionMode: context.extensionMode,
        globalStorageUri: context.globalStorageUri,
        logUri: context.logUri,
        logPath: context.logPath,
        globalStoragePath: context.globalStoragePath,
        extension: context.extension,
        secrets: context.secrets,
        storageUri: context.storageUri,
        extensionPath: context.extensionPath + '/client/3rd/vscode-lua-doc',
        ViewType: 'lua-doc',
        OpenCommand: 'extension.lua.doc',
    };
    extension_js_1.default.activate(luaDocContext);
    psi.activate(context);
    // Register and activate addon manager
    addonManager.activate(context);
    return {
        async reportAPIDoc(params) {
            await languageserver.reportAPIDoc(params);
        },
        async setConfig(changes) {
            await languageserver.setConfig(changes);
        }
    };
}
function deactivate() {
    languageserver.deactivate();
}
//# sourceMappingURL=extension.js.map