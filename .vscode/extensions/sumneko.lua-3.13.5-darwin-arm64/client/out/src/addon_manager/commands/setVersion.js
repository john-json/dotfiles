"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_service_1 = require("../services/logging.service");
const addonManager_service_1 = __importDefault(require("../services/addonManager.service"));
const webvue_1 = require("../types/webvue");
const WebVue_1 = require("../panels/WebVue");
const localLogger = (0, logging_service_1.createChildLogger)("Set Version");
exports.default = async (context, message) => {
    const addon = addonManager_service_1.default.addons.get(message.data.name);
    try {
        if (message.data.version === "Latest") {
            await addon.update();
        }
        else {
            await addon.checkout(message.data.version);
        }
    }
    catch (e) {
        localLogger.error(`Failed to checkout version ${message.data.version}: ${e}`);
        WebVue_1.WebVue.sendNotification({
            level: webvue_1.NotificationLevels.error,
            message: `Failed to checkout version ${message.data.version}`,
        });
    }
};
//# sourceMappingURL=setVersion.js.map