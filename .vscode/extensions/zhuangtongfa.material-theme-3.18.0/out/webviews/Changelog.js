"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangelogWebview = void 0;
const Webview_1 = require("./Webview");
const vscode_1 = require("vscode");
const util_1 = require("util");
const path = require("path");
const marked_1 = require("marked");
class ChangelogWebview extends Webview_1.WebviewController {
    get id() {
        return 'Onedark Pro.Changelog';
    }
    get title() {
        return 'Onedark Pro theme Changelog';
    }
    get content() {
        const changelogPath = vscode_1.Uri.file(path.join(__dirname, '../../', 'CHANGELOG.md'));
        return Promise.resolve(vscode_1.workspace.fs.readFile(changelogPath))
            .then((data) => new util_1.TextDecoder().decode(data))
            .then((content) => marked_1.marked.parse(content));
    }
}
exports.ChangelogWebview = ChangelogWebview;
//# sourceMappingURL=Changelog.js.map