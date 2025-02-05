"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Prettier = require("prettier");
function activate(context) {
    context.subscriptions.push(vscode_1.languages.registerDocumentFormattingEditProvider("toml", {
        provideDocumentFormattingEdits(document, options, _token) {
            const start = new vscode_1.Position(0, 0);
            const end = new vscode_1.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode_1.Range(start, end);
            const text = document.getText(range);
            const fmtText = Prettier.format(text, {
                filepath: "foo.toml",
                tabWidth: options.tabSize,
                useTabs: !options.insertSpaces,
                endOfLine: "auto",
            });
            return [new vscode_1.TextEdit(range, fmtText)];
        },
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map