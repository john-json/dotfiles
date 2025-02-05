"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
function getCursorWordBoundry(documentText, position) {
    const line = documentText.split(/\r?\n/g)[position.line];
    const beginningOfLineWordRegex = /^\w*[a-zA-Z_]+\w*\b/g;
    const endOfLineWordRegex = /\b\w*[a-zA-Z_]+\w*$/g;
    const leadingText = line.substring(0, position.character);
    const prefix = leadingText.match(endOfLineWordRegex);
    const prefixString = prefix ? prefix[0] : '';
    const prefixStartPosition = vscode_languageserver_1.Position.create(position.line, position.character - prefixString.length);
    const trailingText = line.substring(position.character);
    const suffix = trailingText.match(beginningOfLineWordRegex);
    const suffixString = suffix ? suffix[0] : '';
    const suffixEndPosition = vscode_languageserver_1.Position.create(position.line, position.character + suffixString.length);
    return {
        prefixStartPosition,
        suffixEndPosition
    };
}
exports.getCursorWordBoundry = getCursorWordBoundry;
function getNodeRange(node) {
    return {
        start: {
            character: node.loc.start.column,
            line: node.loc.start.line - 1
        },
        end: {
            character: node.loc.end.column,
            line: node.loc.end.line - 1
        }
    };
}
exports.getNodeRange = getNodeRange;
function matchesQuery(query, name) {
    if (query.length === 0) {
        return true;
    }
    if (name === null) {
        return false;
    }
    return name.toLowerCase().indexOf(query) !== -1;
}
exports.matchesQuery = matchesQuery;
;
//# sourceMappingURL=utils.js.map