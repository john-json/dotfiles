"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const filesystem_service_1 = __importDefault(require("./filesystem.service"));
const logging_service_1 = require("./logging.service");
const addon_1 = require("../models/addon");
const git_service_1 = require("./git.service");
const WebVue_1 = require("../panels/WebVue");
const webvue_1 = require("../types/webvue");
const localLogger = (0, logging_service_1.createChildLogger)("Addon Manager");
class AddonManager {
    addons;
    constructor() {
        this.addons = new Map();
    }
    async fetchAddons(installLocation) {
        try {
            await git_service_1.git.fetch();
            await git_service_1.git.pull();
        }
        catch (e) {
            const message = "Failed to fetch addons! Please check your connection to GitHub.";
            localLogger.error(message, { report: false });
            localLogger.error(e, { report: false });
            WebVue_1.WebVue.sendNotification({
                level: webvue_1.NotificationLevels.error,
                message,
            });
        }
        const ignoreList = [".DS_Store"];
        let addons = await filesystem_service_1.default.readDirectory(installLocation);
        if (addons) {
            addons = addons.filter((a) => !ignoreList.includes(a.name));
        }
        if (!addons || addons.length === 0) {
            localLogger.warn("No addons found in installation folder");
            return;
        }
        for (const addon of addons) {
            this.addons.set(addon.name, new addon_1.Addon(addon.name, addon.uri));
            localLogger.verbose(`Found ${addon.name}`);
        }
        return await this.checkUpdated();
    }
    async checkUpdated() {
        const diff = await git_service_1.git.diffSummary(["main", "origin/main"]);
        this.addons.forEach((addon) => {
            addon.checkForUpdate(diff.files);
        });
    }
    unlockAddon(name) {
        const addon = this.addons.get(name);
        return addon?.setLock(false);
    }
}
exports.default = new AddonManager();
//# sourceMappingURL=addonManager.service.js.map