"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class VersionSelector extends vscode.Disposable {
    constructor() {
        super(() => this.dispose());
        this.defaultVersion = '5.1';
        this.availableVersions = ['5.1', '5.2', '5.3'];
        this.statusBarEntry = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, Number.MIN_VALUE);
        this.onChangeEditorSubscription = vscode.window.onDidChangeActiveTextEditor(this.updateVisibility, this);
        this.onConfigChangedSubscription = vscode.workspace.onDidChangeConfiguration(() => this.updateTextFromConfiguration());
        const selectVersionCommand = 'lua.selectVersion';
        this.statusBarEntry.tooltip = 'Select Lua Version';
        this.statusBarEntry.command = selectVersionCommand;
        this.onSelectVersionCommand = vscode.commands.registerCommand(selectVersionCommand, this.showVersionPicker, this);
        this.updateTextFromConfiguration();
        this.updateVisibility();
    }
    dispose() {
        this.statusBarEntry.dispose();
        this.onChangeEditorSubscription.dispose();
        this.onSelectVersionCommand.dispose();
        this.onConfigChangedSubscription.dispose();
    }
    updateTextFromConfiguration() {
        const targetVersion = vscode.workspace.getConfiguration().get('lua.targetVersion');
        this.statusBarEntry.text = this.availableVersions.includes(targetVersion)
            ? targetVersion
            : this.defaultVersion;
    }
    updateVisibility() {
        if (!this.statusBarEntry) {
            return;
        }
        if (!vscode.window.activeTextEditor) {
            this.statusBarEntry.hide();
            return;
        }
        const document = vscode.window.activeTextEditor.document;
        if (vscode.languages.match('lua', document)) {
            this.statusBarEntry.show();
        }
        else {
            this.statusBarEntry.hide();
        }
    }
    showVersionPicker() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedOption = yield vscode.window.showQuickPick(this.availableVersions, {
                placeHolder: 'Select the version of Lua to target'
            });
            if (!selectedOption) {
                return;
            }
            yield vscode.workspace.getConfiguration().update('lua.targetVersion', selectedOption);
            this.updateTextFromConfiguration();
        });
    }
}
exports.VersionSelector = VersionSelector;
//# sourceMappingURL=versionSelector.js.map