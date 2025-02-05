"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateJBM = exports.firstTimeActivation = exports.JBMActivationPrompt = exports.JBMActivation = exports.dirOpen = void 0;
const vscode = require("vscode");
const path = require("path");
const defaultSettings_1 = require("./defaultSettings");
const showDialog = vscode.window.showInformationMessage;
const JBMPath = (context) => path.resolve(context.extensionPath, "JetBrainsMono");
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
function JBMActivation(context) {
    const JBMAddress = JBMPath(context);
    updateUserSettings(defaultSettings_1.defaultSettings);
    dirOpen(JBMAddress);
    showDialog(`${context.extension.packageJSON.displayName} is activated!`);
    showDialog(`Important Note - Don't forget to install fonts! Font Directory will open, once you have manually installed fonts, restart VSCODE - ${JBMAddress}`);
}
exports.JBMActivation = JBMActivation;
const JBMActivationPrompt = (context) => showDialog("Activate JetBrains Mono?", "Yes", "No").then((value) => value === "Yes"
    ? JBMActivation(context)
    : showDialog("You can activate JetBrains Mono later by running 'JetBrainsMono' or 'JBM' in command palette."));
exports.JBMActivationPrompt = JBMActivationPrompt;
function firstTimeActivation(context) {
    var _a;
    const version = (_a = context.extension.packageJSON.version) !== null && _a !== void 0 ? _a : "1.0.0";
    const previousVersion = context.globalState.get(context.extension.id);
    if (previousVersion === version)
        return;
    JBMActivation(context);
    context.globalState.update(context.extension.id, version);
}
exports.firstTimeActivation = firstTimeActivation;
function deactivateJBM(context) {
    // context.globalState.update(context.extension.id, undefined);
    updateUserSettings(defaultSettings_1.defaultSettings, true);
    showDialog(`${context.extension.packageJSON.displayName} is deactivated!`);
}
exports.deactivateJBM = deactivateJBM;
//# sourceMappingURL=util.js.map