"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateFiraCode = exports.firstTimeActivation = exports.firaCodeActivationPrompt = exports.firaCodeActivation = exports.dirOpen = void 0;
const vscode = require("vscode");
const path = require("path");
const defaultSettings_1 = require("./defaultSettings");
const showDialog = vscode.window.showInformationMessage;
const firacodePath = (context) => path.resolve(context.extensionPath, "firaCodeFont");
const updateUserSettings = (settings, remove = false) => Object.entries(settings).forEach(([key, value]) => vscode.workspace
    .getConfiguration()
    .update(key, remove ? undefined : value, vscode.ConfigurationTarget.Global));
function dirOpen(dirPath) {
    let command = "";
    switch (process.platform) {
        case "darwin":
            command = "open";
            break;
        case "win32":
            command = "explorer";
            break;
        default:
            command = "xdg-open";
            break;
    }
    return require("child_process").exec(`${command} ${dirPath}`);
}
exports.dirOpen = dirOpen;
function firaCodeActivation(context) {
    const firacodeAddress = firacodePath(context);
    updateUserSettings(defaultSettings_1.defaultSettings);
    dirOpen(firacodeAddress);
    showDialog(`${context.extension.packageJSON.displayName} is activated!`);
    showDialog(`Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${firacodeAddress}`);
}
exports.firaCodeActivation = firaCodeActivation;
const firaCodeActivationPrompt = (context) => showDialog("Activate FiraCode?", "Yes", "No").then((value) => value === "Yes"
    ? firaCodeActivation(context)
    : showDialog("You can activate FiraCode later by running 'firacode' in command palette."));
exports.firaCodeActivationPrompt = firaCodeActivationPrompt;
function firstTimeActivation(context) {
    var _a;
    const version = (_a = context.extension.packageJSON.version) !== null && _a !== void 0 ? _a : "1.0.0";
    const previousVersion = context.globalState.get(context.extension.id);
    if (previousVersion === version)
        return;
    firaCodeActivation(context);
    context.globalState.update(context.extension.id, version);
}
exports.firstTimeActivation = firstTimeActivation;
function deactivateFiraCode(context) {
    // context.globalState.update(context.extension.id, undefined);
    updateUserSettings(defaultSettings_1.defaultSettings, true);
    showDialog(`${context.extension.packageJSON.displayName} is deactivated!`);
}
exports.deactivateFiraCode = deactivateFiraCode;
//# sourceMappingURL=util.js.map