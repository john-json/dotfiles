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
const vscode = __importStar(require("vscode"));
const addonManager_service_1 = __importDefault(require("../services/addonManager.service"));
const config_1 = require("../config");
const WebVue_1 = require("../panels/WebVue");
const config_2 = require("../config");
exports.default = async (context) => {
    WebVue_1.WebVue.setLoadingState(true);
    const installLocation = vscode.Uri.joinPath((0, config_2.getStorageUri)(context), "addonManager", config_1.ADDONS_DIRECTORY);
    await addonManager_service_1.default.fetchAddons(installLocation);
    WebVue_1.WebVue.setLoadingState(false);
};
//# sourceMappingURL=refreshAddons.js.map