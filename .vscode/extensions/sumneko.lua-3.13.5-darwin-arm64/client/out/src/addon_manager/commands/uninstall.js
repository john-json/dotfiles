"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addonManager_service_1 = __importDefault(require("../services/addonManager.service"));
exports.default = async (context, message) => {
    const addon = addonManager_service_1.default.addons.get(message.data.name);
    addon?.uninstall();
};
//# sourceMappingURL=uninstall.js.map