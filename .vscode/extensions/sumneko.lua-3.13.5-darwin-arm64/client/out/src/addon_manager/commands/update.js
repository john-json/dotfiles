"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const addonManager_service_1 = __importDefault(require("../services/addonManager.service"));
const git_service_1 = require("../services/git.service");
const WebVue_1 = require("../panels/WebVue");
const webvue_1 = require("../types/webvue");
const logging_service_1 = require("../services/logging.service");
const localLogger = (0, logging_service_1.createChildLogger)("Update Addon");
exports.default = async (context, message) => {
    const addon = addonManager_service_1.default.addons.get(message.data.name);
    if (!addon) {
        return;
    }
    try {
        await addon.update();
    }
    catch (e) {
        const message = `Failed to update ${addon.name}`;
        localLogger.error(message, { report: false });
        localLogger.error(String(e), { report: false });
        WebVue_1.WebVue.sendNotification({
            level: webvue_1.NotificationLevels.error,
            message,
        });
    }
    await addon.setLock(false);
    const diff = await git_service_1.git.diffSummary(["HEAD", "origin/main"]);
    addon.checkForUpdate(diff.files);
};
//# sourceMappingURL=update.js.map