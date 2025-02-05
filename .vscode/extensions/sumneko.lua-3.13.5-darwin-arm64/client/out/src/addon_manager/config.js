"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INFO_FILENAME = exports.CONFIG_FILENAME = exports.PLUGIN_FILENAME = exports.LIBRARY_SETTING = exports.GIT_DOWNLOAD_URL = exports.ADDONS_DIRECTORY = exports.REPOSITORY_ISSUES_URL = exports.REPOSITORY_NAME = exports.REPOSITORY_OWNER = exports.REPOSITORY = exports.DEVELOPMENT_IFRAME_URL = void 0;
exports.getStorageUri = getStorageUri;
exports.setGlobalStorageUri = setGlobalStorageUri;
// Development
exports.DEVELOPMENT_IFRAME_URL = "http://127.0.0.1:5173";
// GitHub Repository Info
exports.REPOSITORY = {
    PATH: "https://github.com/LuaLS/LLS-Addons.git",
    DEFAULT_BRANCH: "main",
};
exports.REPOSITORY_OWNER = "carsakiller";
exports.REPOSITORY_NAME = "LLS-Addons";
exports.REPOSITORY_ISSUES_URL = "https://github.com/LuaLS/vscode-lua/issues/new?template=bug_report.yml";
exports.ADDONS_DIRECTORY = "addons";
exports.GIT_DOWNLOAD_URL = "https://git-scm.com/downloads";
// settings.json file info
exports.LIBRARY_SETTING = "Lua.workspace.library";
// Addon files
exports.PLUGIN_FILENAME = "plugin.lua";
exports.CONFIG_FILENAME = "config.json";
exports.INFO_FILENAME = "info.json";
let useGlobal = true;
function getStorageUri(context) {
    return useGlobal ? context.globalStorageUri : (context.storageUri ?? context.globalStorageUri);
}
function setGlobalStorageUri(use) {
    useGlobal = use;
}
//# sourceMappingURL=config.js.map