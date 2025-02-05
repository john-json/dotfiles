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
exports.Addon = void 0;
const vscode = __importStar(require("vscode"));
const logging_service_1 = require("../services/logging.service");
const config_1 = require("../config");
const WebVue_1 = require("../panels/WebVue");
const settings_service_1 = require("../services/settings.service");
const git_service_1 = require("../services/git.service");
const filesystem_service_1 = __importDefault(require("../services/filesystem.service"));
const languageserver_1 = require("../../languageserver");
const localLogger = (0, logging_service_1.createChildLogger)("Addon");
class Addon {
    name;
    uri;
    #displayName;
    /** Whether or not this addon is currently processing an operation. */
    #processing;
    /** The workspace folders that this addon is enabled in. */
    #enabled;
    /** Whether or not this addon has an update available from git. */
    #hasUpdate;
    /** Whether or not this addon is installed */
    #installed;
    constructor(name, path) {
        this.name = name;
        this.uri = path;
        this.#enabled = [];
        this.#hasUpdate = false;
        this.#installed = false;
    }
    get displayName() {
        return this.#displayName ?? this.name;
    }
    /** Fetch addon info from `info.json` */
    async fetchInfo() {
        const infoFilePath = vscode.Uri.joinPath(this.uri, config_1.INFO_FILENAME);
        const modulePath = vscode.Uri.joinPath(this.uri, "module");
        const rawInfo = await filesystem_service_1.default.readFile(infoFilePath);
        const info = JSON.parse(rawInfo);
        this.#displayName = info.name;
        const moduleGit = git_service_1.git.cwd({ path: modulePath.fsPath, root: false });
        let currentVersion = null;
        let tags = [];
        await this.getEnabled();
        if (this.#installed) {
            await git_service_1.git.fetch(["origin", "--prune", "--prune-tags"]);
            tags = (await moduleGit.tags([
                "--sort=-taggerdate",
                "--merged",
                `origin/${await this.getDefaultBranch()}`,
            ])).all;
            const currentTag = await moduleGit
                .raw(["describe", "--tags", "--exact-match"])
                .catch((err) => {
                return null;
            });
            const commitsBehindLatest = await moduleGit.raw([
                "rev-list",
                `HEAD..origin/${await this.getDefaultBranch()}`,
                "--count",
            ]);
            if (Number(commitsBehindLatest) < 1) {
                currentVersion = "Latest";
            }
            else if (currentTag != "") {
                currentVersion = currentTag;
            }
            else {
                currentVersion = await moduleGit
                    .revparse(["--short", "HEAD"])
                    .catch((err) => {
                    localLogger.warn(`Failed to get current hash for ${this.name}: ${err}`);
                    return null;
                });
            }
        }
        return {
            name: info.name,
            description: info.description,
            size: info.size,
            hasPlugin: info.hasPlugin,
            tags: tags,
            version: currentVersion,
        };
    }
    /** Get the `config.json` for this addon. */
    async getConfigurationFile() {
        const configURI = vscode.Uri.joinPath(this.uri, "module", config_1.CONFIG_FILENAME);
        try {
            const rawConfig = await filesystem_service_1.default.readFile(configURI);
            const config = JSON.parse(rawConfig);
            return config;
        }
        catch (e) {
            localLogger.error(`Failed to read config.json file for ${this.name} (${e})`);
            throw e;
        }
    }
    /** Update this addon using git. */
    async update() {
        return git_service_1.git
            .submoduleUpdate([this.uri.fsPath])
            .then((message) => localLogger.debug(message));
    }
    async getDefaultBranch() {
        // Get branch from .gitmodules if specified
        const targetBranch = await git_service_1.git.raw("config", "-f", ".gitmodules", "--get", `submodule.addons/${this.name}/module.branch`);
        if (targetBranch) {
            return targetBranch;
        }
        // Fetch default branch from remote
        const modulePath = vscode.Uri.joinPath(this.uri, "module");
        const result = (await git_service_1.git
            .cwd({ path: modulePath.fsPath, root: false })
            .remote(["show", "origin"]));
        const match = result.match(/HEAD branch: (\w+)/);
        return match[1];
    }
    async pull() {
        const modulePath = vscode.Uri.joinPath(this.uri, "module");
        return await git_service_1.git.cwd({ path: modulePath.fsPath, root: false }).pull();
    }
    async checkout(obj) {
        const modulePath = vscode.Uri.joinPath(this.uri, "module");
        return git_service_1.git
            .cwd({ path: modulePath.fsPath, root: false })
            .checkout([obj]);
    }
    /** Check whether this addon is enabled, given an array of enabled library paths.
     * @param libraryPaths An array of paths from the `Lua.workspace.library` setting.
     */
    checkIfEnabled(libraryPaths) {
        const regex = new RegExp(`${this.name}\/module\/library`, "g");
        const index = libraryPaths.findIndex((path) => regex.test(path));
        return index !== -1;
    }
    /** Get the enabled state for this addon in all opened workspace folders */
    async getEnabled() {
        const folders = await (0, settings_service_1.getLibraryPaths)();
        // Check all workspace folders for a path that matches this addon
        const folderStates = folders.map((entry) => {
            return {
                folder: entry.folder,
                enabled: this.checkIfEnabled(entry.paths),
            };
        });
        folderStates.forEach((entry) => (this.#enabled[entry.folder.index] = entry.enabled));
        const moduleURI = vscode.Uri.joinPath(this.uri, "module");
        const exists = await filesystem_service_1.default.exists(moduleURI);
        const empty = await filesystem_service_1.default.empty(moduleURI);
        this.#installed = exists && !empty;
        return folderStates;
    }
    async enable(folder, installLocation) {
        const librarySetting = ((await (0, languageserver_1.getConfig)(config_1.LIBRARY_SETTING, folder.uri)) ?? []);
        const enabled = await this.checkIfEnabled(librarySetting);
        if (enabled) {
            localLogger.warn(`${this.name} is already enabled`);
            this.#enabled[folder.index] = true;
            return;
        }
        // Init submodule
        try {
            await git_service_1.git.submoduleInit([this.uri.fsPath]);
            localLogger.debug("Initialized submodule");
        }
        catch (e) {
            localLogger.warn(`Unable to initialize submodule for ${this.name}`);
            localLogger.warn(e);
            throw e;
        }
        try {
            await git_service_1.git.submoduleUpdate([this.uri.fsPath]);
            localLogger.debug("Submodule up to date");
        }
        catch (e) {
            localLogger.warn(`Unable to update submodule for ${this.name}`);
            localLogger.warn(e);
            throw e;
        }
        // Apply addon settings
        const libraryPath = vscode.Uri.joinPath(this.uri, "module", "library").path.replace(installLocation.path, "${addons}");
        const configValues = await this.getConfigurationFile();
        try {
            await (0, languageserver_1.setConfig)([
                {
                    action: "add",
                    key: config_1.LIBRARY_SETTING,
                    value: libraryPath,
                    uri: folder.uri,
                },
            ]);
            if (configValues.settings) {
                await (0, settings_service_1.applyAddonSettings)(folder, configValues.settings);
                localLogger.info(`Applied addon settings for ${this.name}`);
            }
        }
        catch (e) {
            localLogger.warn(`Failed to apply settings of "${this.name}"`);
            localLogger.warn(e);
            return;
        }
        this.#enabled[folder.index] = true;
        localLogger.info(`Enabled "${this.name}"`);
    }
    async disable(folder, silent = false) {
        const librarySetting = ((await (0, languageserver_1.getConfig)(config_1.LIBRARY_SETTING, folder.uri)) ?? []);
        const regex = new RegExp(`addons}?[/\\\\]+${this.name}[/\\\\]+module[/\\\\]+library`, "g");
        const index = librarySetting.findIndex((path) => regex.test(path));
        if (index === -1) {
            if (!silent)
                localLogger.warn(`"${this.name}" is already disabled`);
            this.#enabled[folder.index] = false;
            return;
        }
        // Remove this addon from the library list
        librarySetting.splice(index, 1);
        const result = await (0, languageserver_1.setConfig)([
            {
                action: "set",
                key: config_1.LIBRARY_SETTING,
                value: librarySetting,
                uri: folder.uri,
            },
        ]);
        if (!result) {
            localLogger.error(`Failed to update ${config_1.LIBRARY_SETTING} when disabling ${this.name}`);
            return;
        }
        // Remove addon settings if installed
        if (this.#installed) {
            const configValues = await this.getConfigurationFile();
            try {
                if (configValues.settings)
                    await (0, settings_service_1.revokeAddonSettings)(folder, configValues.settings);
            }
            catch (e) {
                localLogger.error(`Failed to revoke settings of "${this.name}"`);
                return;
            }
        }
        this.#enabled[folder.index] = false;
        localLogger.info(`Disabled "${this.name}"`);
    }
    async uninstall() {
        for (const folder of vscode.workspace.workspaceFolders ?? []) {
            await this.disable(folder, true);
        }
        const files = (await filesystem_service_1.default.readDirectory(vscode.Uri.joinPath(this.uri, "module"), { depth: 1 })) ?? [];
        files.map((f) => {
            return filesystem_service_1.default.deleteFile(f.uri, {
                recursive: true,
                useTrash: false,
            });
        });
        await Promise.all(files);
        localLogger.info(`Uninstalled ${this.name}`);
        this.#installed = false;
        this.setLock(false);
    }
    /** Convert this addon to an object ready for sending to WebVue. */
    async toJSON() {
        await this.getEnabled();
        const { name, description, size, hasPlugin, tags, version } = await this.fetchInfo();
        const enabled = this.#enabled;
        const installTimestamp = (await git_service_1.git.log()).latest?.date;
        const hasUpdate = this.#hasUpdate;
        return {
            name: this.name,
            displayName: name,
            description,
            enabled,
            hasPlugin,
            installTimestamp,
            size,
            hasUpdate,
            processing: this.#processing,
            installed: this.#installed,
            tags,
            version,
        };
    }
    checkForUpdate(modified) {
        this.#hasUpdate = false;
        if (modified.findIndex((modifiedItem) => modifiedItem.file.includes(this.name)) !== -1) {
            localLogger.info(`Found update for "${this.name}"`);
            this.#hasUpdate = true;
        }
        return this.#hasUpdate;
    }
    /** Get a list of options for a quick picker that lists the workspace
     * folders that the addon is enabled/disabled in.
     * @param enabledState The state the addon must be in in a folder to be included.
     * `true` will only return the folders that the addon is **enabled** in.
     * `false` will only return the folders that the addon is **disabled** in
     */
    async getQuickPickerOptions(enabledState) {
        return (await this.getEnabled())
            .filter((entry) => entry.enabled === enabledState)
            .map((entry) => {
            return {
                label: entry.folder.name,
                detail: entry.folder.uri.path,
            };
        });
    }
    async setLock(state) {
        this.#processing = state;
        return this.sendToWebVue();
    }
    /** Send this addon to WebVue. */
    async sendToWebVue() {
        WebVue_1.WebVue.sendMessage("addAddon", { addons: await this.toJSON() });
    }
}
exports.Addon = Addon;
//# sourceMappingURL=addon.js.map