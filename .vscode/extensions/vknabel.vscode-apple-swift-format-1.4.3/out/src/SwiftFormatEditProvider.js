"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwiftFormatEditProvider = void 0;
var vscode = require("vscode");
var Current_1 = require("./Current");
var UserInteraction_1 = require("./UserInteraction");
var fs_1 = require("fs");
var path_1 = require("path");
var execShell_1 = require("./execShell");
var wholeDocumentRange = new vscode.Range(0, 0, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
function userDefinedFormatOptionsForDocument(document) {
    var workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    var rootPath = (workspaceFolder && workspaceFolder.uri.fsPath) ||
        vscode.workspace.rootPath ||
        "./";
    var searchPaths = Current_1.default.config
        .formatConfigSearchPaths()
        .map(function (current) { return (0, path_1.resolve)(rootPath, current); });
    var existingConfig = searchPaths.find(fs_1.existsSync);
    var options = existingConfig != null ? ["--configuration", existingConfig] : [];
    return {
        options: options,
        hasConfig: existingConfig != null,
    };
}
function format(request) {
    try {
        var swiftFormatPath = Current_1.default.config.swiftFormatPath(request.document);
        if (swiftFormatPath == null) {
            return [];
        }
        var input = request.document.getText(request.range);
        if (input.trim() === "")
            return [];
        var userDefinedParams = userDefinedFormatOptionsForDocument(request.document);
        if (!userDefinedParams.hasConfig && Current_1.default.config.onlyEnableWithConfig()) {
            return [];
        }
        var newContents = (0, execShell_1.execShellSync)(swiftFormatPath[0], __spreadArray(__spreadArray(__spreadArray([], swiftFormatPath.slice(1), true), userDefinedParams.options, true), (request.parameters || []), true), {
            encoding: "utf8",
            input: input,
        });
        return newContents !== request.document.getText(request.range)
            ? [
                vscode.TextEdit.replace(request.document.validateRange(request.range || wholeDocumentRange), newContents),
            ]
            : [];
    }
    catch (error) {
        (0, UserInteraction_1.handleFormatError)(error, request.document);
        return [];
    }
}
var SwiftFormatEditProvider = /** @class */ (function () {
    function SwiftFormatEditProvider() {
    }
    SwiftFormatEditProvider.prototype.provideDocumentRangeFormattingEdits = function (document, range, formatting) {
        return format({
            document: document,
            parameters: [],
            range: range,
            formatting: formatting,
        });
    };
    SwiftFormatEditProvider.prototype.provideDocumentFormattingEdits = function (document, formatting) {
        return format({ document: document, formatting: formatting });
    };
    return SwiftFormatEditProvider;
}());
exports.SwiftFormatEditProvider = SwiftFormatEditProvider;
//# sourceMappingURL=SwiftFormatEditProvider.js.map