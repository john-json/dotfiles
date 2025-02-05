"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const utils_1 = require("../utils");
class CompletionService {
    constructor(analysis) {
        this.analysis = analysis;
    }
    buildCompletions(query) {
        return this.analysis.symbols
            .filter(symbol => utils_1.matchesQuery(query, symbol.name))
            .map(symbol => {
            let detail = symbol.display;
            if (!detail) {
                if (symbol.isGlobalScope) {
                    detail = '(global)';
                }
                else if (symbol.kind === 'FunctionParameter') {
                    detail = '(parameter)';
                }
                else if (symbol.isOuterScope) {
                    detail = '(outer)';
                }
                else {
                    detail = '(local)';
                }
            }
            return {
                label: symbol.name,
                kind: this.convertSymbolKindToCompletionKind(symbol),
                detail
            };
        });
    }
    convertSymbolKindToCompletionKind(symbol) {
        switch (symbol.kind) {
            case 'Function':
                return vscode_languageserver_1.CompletionItemKind.Function;
            case 'FunctionParameter':
                return vscode_languageserver_1.CompletionItemKind.Property;
            case 'Variable':
                return vscode_languageserver_1.CompletionItemKind.Variable;
        }
    }
}
exports.CompletionService = CompletionService;
//# sourceMappingURL=completionService.js.map