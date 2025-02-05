"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const TOML = require("@iarna/toml");
const telemetry_1 = require("./telemetry");
// Helper function to format TOML string
function formatTOML(tomlString) {
    const lines = tomlString.split('\n');
    let formattedLines = [];
    let currentIndent = 0;
    for (let line of lines) {
        line = line.trim();
        // Skip empty lines
        if (!line) {
            formattedLines.push('');
            continue;
        }
        // Handle table headers
        if (line.startsWith('[')) {
            // Add blank line before table unless it's the first line
            if (formattedLines.length > 0) {
                formattedLines.push('');
            }
            formattedLines.push(line);
            continue;
        }
        // Handle key-value pairs
        if (line.includes('=')) {
            const [key, ...valueParts] = line.split('=');
            const value = valueParts.join('='); // Rejoin in case value contains =
            formattedLines.push(`${key.trim()} = ${value.trim()}`);
            continue;
        }
        // Handle arrays and other content
        formattedLines.push('  '.repeat(currentIndent) + line);
    }
    return formattedLines.join('\n');
}
function activate(context) {
    (0, telemetry_1.initializeTelemetryReporter)(context);
    (0, telemetry_1.TelemetryLog)('info', 'Extension activated');
    // Register the formatting provider
    let formattingProvider = vscode.languages.registerDocumentFormattingEditProvider('toml', {
        provideDocumentFormattingEdits(document) {
            (0, telemetry_1.TelemetryLog)('info', 'Formatting TOML document');
            const text = document.getText();
            try {
                // Parse TOML to check validity
                const parsed = TOML.parse(text);
                // Format by stringifying and applying custom formatting
                let formatted = TOML.stringify(parsed);
                // Apply custom formatting
                formatted = formatTOML(formatted);
                // Return the formatting edit
                const firstLine = document.lineAt(0);
                const lastLine = document.lineAt(document.lineCount - 1);
                const range = new vscode.Range(firstLine.range.start, lastLine.range.end);
                return [vscode.TextEdit.replace(range, formatted)];
            }
            catch (error) {
                (0, telemetry_1.TelemetryLog)('error', `Error formatting TOML: ${error}`);
                vscode.window.showErrorMessage('Error formatting TOML: Invalid syntax');
                return [];
            }
        }
    });
    // Register the format document command
    let formatCommand = vscode.commands.registerCommand('vscode-toml.formatDocument', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId === 'toml') {
            try {
                await vscode.commands.executeCommand('editor.action.formatDocument');
                (0, telemetry_1.TelemetryLog)('info', 'Document formatted via command');
            }
            catch (error) {
                (0, telemetry_1.TelemetryLog)('error', `Error executing format command: ${error}`);
                vscode.window.showErrorMessage('Error formatting TOML document');
            }
        }
    });
    // Register the document symbol provider
    let symbolProvider = vscode.languages.registerDocumentSymbolProvider('toml', {
        provideDocumentSymbols(document) {
            const symbols = [];
            const text = document.getText();
            try {
                const parsed = TOML.parse(text);
                // Recursively add symbols from the parsed TOML
                function addSymbols(obj, container = '') {
                    for (const [key, value] of Object.entries(obj)) {
                        const path = container ? `${container}.${key}` : key;
                        if (typeof value === 'object' && value !== null) {
                            // Add table as container
                            symbols.push(new vscode.SymbolInformation(key, vscode.SymbolKind.Namespace, container, new vscode.Location(document.uri, new vscode.Position(0, 0))));
                            addSymbols(value, path);
                        }
                        else {
                            // Add value as field
                            symbols.push(new vscode.SymbolInformation(key, vscode.SymbolKind.Field, container, new vscode.Location(document.uri, new vscode.Position(0, 0))));
                        }
                    }
                }
                addSymbols(parsed);
            }
            catch (error) {
                // Ignore parsing errors for symbol provider
            }
            return symbols;
        }
    });
    // Register diagnostic provider
    let diagnosticCollection = vscode.languages.createDiagnosticCollection('toml');
    function updateDiagnostics(document) {
        if (document.languageId !== 'toml') {
            return;
        }
        const diagnostics = [];
        const text = document.getText();
        try {
            TOML.parse(text);
            // Clear diagnostics if parsing succeeds
            diagnosticCollection.set(document.uri, []);
        }
        catch (error) {
            // Add diagnostic for parsing error
            (0, telemetry_1.TelemetryLog)('error', `Error parsing TOML: ${error}`);
            const message = error.message || 'Invalid TOML syntax';
            const diagnostic = new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0), message, vscode.DiagnosticSeverity.Error);
            diagnostics.push(diagnostic);
            diagnosticCollection.set(document.uri, diagnostics);
        }
    }
    // Update diagnostics on document changes
    let changeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        updateDiagnostics(event.document);
    });
    // Update diagnostics on document open
    let openDisposable = vscode.workspace.onDidOpenTextDocument(document => {
        updateDiagnostics(document);
    });
    context.subscriptions.push(formattingProvider, formatCommand, symbolProvider, diagnosticCollection, changeDisposable, openDisposable);
}
exports.activate = activate;
function deactivate() {
    (0, telemetry_1.TelemetryLog)('info', 'Extension deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map