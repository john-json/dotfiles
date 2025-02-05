"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const Prettier = require("prettier");
function activate(context) {
    let disposable = vscode_1.languages.registerDocumentFormattingEditProvider("toml", {
        provideDocumentFormattingEdits(document, options, token) {
            const result = [];
            const start = new vscode_1.Position(0, 0);
            const end = new vscode_1.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
            const range = new vscode_1.Range(start, end);
            let text = document.getText(range);
            let fmtText = Prettier.format(text, { filepath: "foo.toml" });
            result.push(new vscode_1.TextEdit(range, fmtText.toString()));
            return result;
        },
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=main.js.map