"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const utils_1 = require("../utils");
const vscode_uri_1 = require("vscode-uri");
function buildWorkspaceSymbols(path, query, analysis) {
    const symbols = [];
    const uri = vscode_uri_1.default.file(path);
    for (const symbol of analysis.symbols.filter(sym => sym.isGlobalScope && utils_1.matchesQuery(query, sym.name))) {
        if (symbol.kind === 'Function') {
            if (symbol.name === null) {
                continue;
            }
            symbols.push({
                name: symbol.name,
                containerName: symbol.container || undefined,
                kind: vscode_languageserver_1.SymbolKind.Function,
                location: vscode_languageserver_1.Location.create(uri.toString(), symbol.range)
            });
        }
        else if (symbol.kind === 'Variable') {
            if (symbol.name === null) {
                continue;
            }
            symbols.push({
                name: symbol.name,
                kind: vscode_languageserver_1.SymbolKind.Variable,
                location: vscode_languageserver_1.Location.create(uri.toString(), symbol.range)
            });
        }
    }
    return symbols;
}
exports.buildWorkspaceSymbols = buildWorkspaceSymbols;
//# sourceMappingURL=workspaceSymbolService.js.map