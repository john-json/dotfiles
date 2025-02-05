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
const vscode_languageserver_1 = require("vscode-languageserver");
const utils_1 = require("./utils");
const Analysis = require("./analysis");
const completionService_1 = require("./services/completionService");
const documentSymbolService_1 = require("./services/documentSymbolService");
const workspaceSymbolService_1 = require("./services/workspaceSymbolService");
const lintingService_1 = require("./services/lintingService");
const formatService_1 = require("./services/formatService");
const node_dir_1 = require("node-dir");
const vscode_uri_1 = require("vscode-uri");
const luaparse = require("luaparse");
class ServiceDispatcher {
    constructor() {
        this.connection = vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process));
        this.rootUri = null;
        this.settings = {};
        this.documents = new vscode_languageserver_1.TextDocuments();
        this.perDocumentAnalysis = new Map();
        this.triggerCharacters = ['.', ':'];
        this.documents.onDidChangeContent(change => this.onDidChangeContent(change));
        this.documents.onDidClose(change => this.onDidClose(change));
        this.connection.onInitialize(handler => this.onInitialize(handler));
        this.connection.onCompletion(pos => this.onCompletion(pos));
        this.connection.onDocumentSymbol(handler => this.onDocumentSymbol(handler));
        this.connection.onWorkspaceSymbol(handler => this.onWorkspaceSymbol(handler));
        this.connection.onDidChangeConfiguration(change => this.onDidChangeConfiguration(change));
        this.connection.onDocumentFormatting((params) => this.onDocumentFormatting(params));
        this.connection.onDocumentRangeFormatting((params) => this.onDocumentRangeFormatting(params));
        this.documents.listen(this.connection);
        this.connection.listen();
    }
    onInitialize(initializeParams) {
        this.rootUri = initializeParams.rootUri;
        return {
            capabilities: {
                textDocumentSync: this.documents.syncKind,
                documentSymbolProvider: true,
                workspaceSymbolProvider: true,
                completionProvider: {
                    resolveProvider: false,
                    triggerCharacters: this.triggerCharacters
                },
                documentFormattingProvider: true,
                documentRangeFormattingProvider: true
            }
        };
    }
    onDocumentSymbol(handler) {
        const uri = handler.textDocument.uri;
        const analysis = this.perDocumentAnalysis[uri];
        return documentSymbolService_1.buildDocumentSymbols(uri, analysis);
    }
    onWorkspaceSymbol(handler) {
        if (!this.rootUri) {
            return [];
        }
        const query = handler.query.toLowerCase();
        return new Promise((resolve, reject) => {
            const symbols = [];
            const callback = (err, content, filename, next) => {
                if (err) {
                    return;
                }
                try {
                    const analysis = new Analysis.Analysis();
                    analysis.end(content.toString());
                    analysis.buildGlobalSymbols();
                    symbols.push(...workspaceSymbolService_1.buildWorkspaceSymbols(filename, query, analysis));
                }
                catch (e) {
                }
                next();
            };
            const uri = vscode_uri_1.default.parse(this.rootUri);
            node_dir_1.readFiles(uri.fsPath, { match: /.lua$/ }, callback, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(symbols);
            });
        });
    }
    onCompletion(textDocumentPosition) {
        const uri = textDocumentPosition.textDocument.uri;
        const document = this.documents.get(uri);
        const documentText = document.getText();
        const { prefixStartPosition, suffixEndPosition } = utils_1.getCursorWordBoundry(documentText, textDocumentPosition.position);
        const startOffset = document.offsetAt(prefixStartPosition);
        const endOffset = document.offsetAt(suffixEndPosition);
        const analysis = new Analysis.Analysis();
        analysis.write(documentText.substring(0, startOffset));
        let isTableScoped = false;
        const charAt = documentText.charAt(startOffset - 1);
        if (this.triggerCharacters.indexOf(charAt) >= 0) {
            analysis.write('__completion_helper__()');
            isTableScoped = true;
        }
        analysis.write('__scope_marker__()');
        try {
            analysis.end(documentText.substring(endOffset));
            analysis.buildScopedSymbols(isTableScoped);
        }
        catch (err) {
            if (!(err instanceof SyntaxError)) {
                throw err;
            }
            return [];
        }
        const suggestionService = new completionService_1.CompletionService(analysis);
        const word = documentText.substring(startOffset, endOffset);
        return suggestionService.buildCompletions(word.toLowerCase());
    }
    onDidChangeContent(change) {
        this.parseAndLintDocument(change.document).then(diagnostics => {
            this.connection.sendDiagnostics({
                uri: change.document.uri,
                diagnostics
            });
        });
    }
    onDidClose(change) {
        this.connection.sendDiagnostics({
            uri: change.document.uri,
            diagnostics: []
        });
    }
    onDidChangeConfiguration(change) {
        const oldVersion = this.settings ? this.settings.targetVersion : null;
        this.settings = change.settings.lua;
        const validateSetting = (v, defaultVal) => {
            if (typeof (v) === typeof (defaultVal)) {
                return v;
            }
            return defaultVal;
        };
        this.settings.preferLuaCheckErrors = validateSetting(this.settings.preferLuaCheckErrors, false);
        if (this.settings.format.indentCount !== null) {
            this.settings.format.indentCount = validateSetting(this.settings.format.indentCount, 4);
        }
        this.settings.format.lineWidth = validateSetting(this.settings.format.lineWidth, 120);
        this.settings.format.singleQuote = validateSetting(this.settings.format.singleQuote, false);
        this.settings.format.linebreakMultipleAssignments = validateSetting(this.settings.format.linebreakMultipleAssignments, false);
        if (!['5.1', '5.2', '5.3'].includes(this.settings.targetVersion)) {
            this.settings.targetVersion = '5.1';
        }
        luaparse.defaultOptions.luaVersion = this.settings.targetVersion;
        if (oldVersion && oldVersion !== this.settings.targetVersion) {
            this.documents.all().forEach((doc) => {
                this.parseAndLintDocument(doc).then(diagnostics => {
                    this.connection.sendDiagnostics({
                        uri: doc.uri,
                        diagnostics
                    });
                });
            });
        }
    }
    onDocumentFormatting(params) {
        const uri = params.textDocument.uri;
        const document = this.documents.get(uri);
        return formatService_1.buildDocumentFormatEdits(uri, document, this.settings.format, params.options);
    }
    onDocumentRangeFormatting(params) {
        const uri = params.textDocument.uri;
        const document = this.documents.get(uri);
        return formatService_1.buildDocumentRangeFormatEdits(uri, document, params.range, this.settings.format, params.options);
    }
    parseAndLintDocument(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentUri = document.uri;
            const documentText = document.getText();
            const parsedUri = vscode_uri_1.default.parse(documentUri);
            if (parsedUri.scheme === 'showModifications') {
                return [];
            }
            const parseDocument = () => {
                return new Promise((resolve) => {
                    try {
                        this.perDocumentAnalysis[documentUri] = new Analysis.Analysis();
                        this.perDocumentAnalysis[documentUri].end(documentText);
                        this.perDocumentAnalysis[documentUri].buildGlobalSymbols();
                        return resolve([]);
                    }
                    catch (err) {
                        if (!(err instanceof SyntaxError)) {
                            throw err;
                        }
                        const e = err;
                        const lines = documentText.split(/\r?\n/g);
                        const line = lines[e.line - 1];
                        const range = vscode_languageserver_1.Range.create(e.line - 1, e.column, e.line - 1, line.length);
                        const message = e.message.match(/\[\d+:\d+\] (.*)/)[1];
                        const diagnostic = {
                            range,
                            message,
                            severity: vscode_languageserver_1.DiagnosticSeverity.Error,
                            source: 'luaparse'
                        };
                        return resolve([diagnostic]);
                    }
                });
            };
            let errors = yield parseDocument();
            try {
                const lintingErrors = lintingService_1.buildLintingErrors(this.settings, documentUri, documentText);
                if (this.settings.preferLuaCheckErrors && lintingErrors.length > 0) {
                    errors = lintingErrors;
                }
                else {
                    errors = errors.concat(lintingErrors);
                }
            }
            catch (e) { }
            return errors;
        });
    }
}
;
let serviceDispatcher = null;
if (module.hot) {
    module.hot.accept();
    module.hot.store(stash => {
        stash.serviceDispatcher = serviceDispatcher;
    });
    module.hot.restore(stash => {
        if (stash.serviceDispatcher) {
            serviceDispatcher = stash.serviceDispatcher;
            const oldProto = Object.getPrototypeOf(serviceDispatcher);
            const newProto = ServiceDispatcher.prototype;
            for (const p of Object.getOwnPropertyNames(newProto)) {
                oldProto[p] = newProto[p];
            }
        }
    });
}
if (serviceDispatcher === null) {
    serviceDispatcher = new ServiceDispatcher();
}
//# sourceMappingURL=server.js.map