"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
class PathManager {
    constructor(context) {
        this.context = context;
    }
    get installationPath() {
        return path.dirname(require.main.filename);
    }
    get bootstrapPath() {
        return path.join(this.installationPath, "bootstrap-amd.js");
    }
    get bootstrapBackupPath() {
        return path.join(this.installationPath, "bootstrap-amd.js.monkey-patch.backup");
    }
    get mainJsPath() {
        return path.join(this.installationPath, "main.js");
    }
    get mainJsBackupPath() {
        return path.join(this.installationPath, "main.js.monkey-patch-backup");
    }
    get workbenchHtmlPath() {
        let res = path.join(this.installationPath, "vs/code/electron-browser/workbench/workbench.html");
        if (fs.existsSync(res)) {
            return res;
        }
        else { // vscode 1.70
            return path.join(this.installationPath, "vs/code/electron-sandbox/workbench/workbench.html");
        }
    }
    get workbenchHtmlReplacementPath() {
        let res = this.workbenchHtmlPath;
        res = res.replace("workbench.html", "workbench-monkey-patch.html");
        return res;
    }
    get extensionDataPath() {
        return path.join(this.context.extensionPath, "data");
    }
    get generatedScriptsPath() {
        return path.join(this.context.globalStoragePath, "modules");
    }
    get mainProcessEntrypointPath() {
        return path.join(this.generatedScriptsPath, "main.js");
    }
    get browserEntrypointPath() {
        return path.join(this.generatedScriptsPath, "browser-entrypoint.js");
    }
}
exports.PathManager = PathManager;
//# sourceMappingURL=path-manager.js.map