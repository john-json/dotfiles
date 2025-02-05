"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const lua_fmt_1 = require("lua-fmt");
const diff_1 = require("diff");
var EditAction;
(function (EditAction) {
    EditAction[EditAction["Replace"] = 0] = "Replace";
    EditAction[EditAction["Insert"] = 1] = "Insert";
    EditAction[EditAction["Delete"] = 2] = "Delete";
})(EditAction || (EditAction = {}));
class Edit {
    constructor(action, start) {
        this.text = '';
        this.action = action;
        this.start = start;
        this.end = vscode_languageserver_1.Position.create(0, 0);
    }
}
function getEditsFromFormattedText(documentUri, originalText, formattedText, startOffset = 0) {
    const diff = lua_fmt_1.producePatch(documentUri, originalText, formattedText);
    const unifiedDiffs = diff_1.parsePatch(diff);
    const edits = [];
    let currentEdit = null;
    for (const uniDiff of unifiedDiffs) {
        for (const hunk of uniDiff.hunks) {
            let startLine = hunk.oldStart + startOffset;
            for (const line of hunk.lines) {
                switch (line[0]) {
                    case '-':
                        if (currentEdit === null) {
                            currentEdit = new Edit(EditAction.Delete, vscode_languageserver_1.Position.create(startLine - 1, 0));
                        }
                        currentEdit.end = vscode_languageserver_1.Position.create(startLine, 0);
                        startLine++;
                        break;
                    case '+':
                        if (currentEdit === null) {
                            currentEdit = new Edit(EditAction.Insert, vscode_languageserver_1.Position.create(startLine - 1, 0));
                        }
                        else if (currentEdit.action === EditAction.Delete) {
                            currentEdit.action = EditAction.Replace;
                        }
                        currentEdit.text += line.substr(1) + '\n';
                        break;
                    case ' ':
                        startLine++;
                        if (currentEdit != null) {
                            edits.push(currentEdit);
                        }
                        currentEdit = null;
                        break;
                }
            }
        }
        if (currentEdit != null) {
            edits.push(currentEdit);
        }
    }
    return edits.map(edit => {
        switch (edit.action) {
            case EditAction.Replace:
                return vscode_languageserver_1.TextEdit.replace(vscode_languageserver_1.Range.create(edit.start, edit.end), edit.text);
            case EditAction.Insert:
                return vscode_languageserver_1.TextEdit.insert(edit.start, edit.text);
            case EditAction.Delete:
                return vscode_languageserver_1.TextEdit.del(vscode_languageserver_1.Range.create(edit.start, edit.end));
        }
    });
}
function buildDocumentFormatEdits(documentUri, document, extFormatOptions, editorFormatOptions) {
    let documentText = document.getText();
    const useTabs = extFormatOptions.useTabs || !editorFormatOptions.insertSpaces;
    const indentCount = extFormatOptions.indentCount || editorFormatOptions.tabSize;
    const formatOptions = {
        writeMode: lua_fmt_1.WriteMode.Diff,
        useTabs,
        indentCount,
        lineWidth: extFormatOptions.lineWidth,
        quotemark: extFormatOptions.singleQuote ? 'single' : 'double',
        linebreakMultipleAssignments: extFormatOptions.linebreakMultipleAssignments
    };
    let formattedText;
    try {
        formattedText = lua_fmt_1.formatText(documentText, formatOptions);
    }
    catch (_a) {
        return [];
    }
    if (process.platform === 'win32') {
        documentText = documentText.split('\r\n').join('\n');
        formattedText = formattedText.split('\r\n').join('\n');
    }
    return getEditsFromFormattedText(documentUri, documentText, formattedText);
}
exports.buildDocumentFormatEdits = buildDocumentFormatEdits;
function buildDocumentRangeFormatEdits(_documentUri, _document, _range, _extFormatOptions, _editorFormatOptions) {
    return [];
}
exports.buildDocumentRangeFormatEdits = buildDocumentRangeFormatEdits;
//# sourceMappingURL=formatService.js.map