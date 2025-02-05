"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const languageserver_1 = require("../languageserver");
const LANGUAGE_ID = "lua";
/**
 * Manages webview panels
 */
class PsiViewer {
    context;
    /**
     * Track the currently panel. Only allow a single panel to exist at a time.
     */
    static currentPanel;
    static viewType = 'LuaPsiView';
    static title = "LuaPsiView";
    static distDirectory = "client/web/dist";
    panel;
    extensionPath;
    builtAppFolder;
    disposables = [];
    timeoutToReqAnn;
    static createOrShow(context) {
        // const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        // If we already have a panel, show it.
        // Otherwise, create angular panel.
        if (PsiViewer.currentPanel) {
            PsiViewer.currentPanel.panel.reveal(vscode.ViewColumn.Two);
        }
        else {
            PsiViewer.currentPanel = new PsiViewer(context, vscode.ViewColumn.Two);
            PsiViewer.currentPanel.active(context);
        }
        return PsiViewer.currentPanel;
    }
    constructor(context, column) {
        this.context = context;
        this.extensionPath = context.extensionPath;
        this.builtAppFolder = PsiViewer.distDirectory;
        // Create and show a new webview panel
        this.panel = vscode.window.createWebviewPanel(PsiViewer.viewType, PsiViewer.title, column, {
            // Enable javascript in the webview
            enableScripts: true,
            // And restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.file(path.join(this.extensionPath, this.builtAppFolder))]
        });
        // Set the webview's initial html content
        this.panel.webview.html = this._getHtmlForWebview();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }
    dispose() {
        PsiViewer.currentPanel = undefined;
        // Clean up our resources
        this.panel.dispose();
        while (this.disposables.length) {
            const x = this.disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    post(message) {
        this.panel.webview.postMessage(message);
    }
    /**
     * Returns html of the start page (index.html)
     */
    _getHtmlForWebview() {
        // path to dist folder
        const appDistPath = path.join(this.extensionPath, PsiViewer.distDirectory);
        const appDistPathUri = vscode.Uri.file(appDistPath);
        // path as uri
        const baseUri = this.panel.webview.asWebviewUri(appDistPathUri);
        // get path to index.html file from dist folder
        const indexPath = path.join(appDistPath, 'index.html');
        // read index file from file system
        let indexHtml = fs.readFileSync(indexPath, { encoding: 'utf8' });
        // update the base URI tag
        indexHtml = indexHtml.replace('<base href="/">', `<base href="${String(baseUri)}/">`);
        return indexHtml;
    }
    active(context) {
        context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(PsiViewer.onDidChangeTextDocument, null, context.subscriptions));
        context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(PsiViewer.onDidChangeActiveTextEditor, null, context.subscriptions));
        context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(PsiViewer.onDidChangeSelection, null, context.subscriptions));
    }
    requestPsi(editor) {
        if (this.timeoutToReqAnn) {
            clearTimeout(this.timeoutToReqAnn);
        }
        this.timeoutToReqAnn = setTimeout(() => {
            this.requestPsiImpl(editor);
        }, 150);
    }
    requestPsiImpl(editor) {
        const client = languageserver_1.defaultClient?.client;
        const params = { uri: editor.document.uri.toString() };
        client?.sendRequest("$/psi/view", params).then(result => {
            if (result) {
                this.post({
                    type: "psi",
                    value: [result.data]
                });
            }
        });
    }
    requestPsiSelect(position, uri) {
        const client = languageserver_1.defaultClient?.client;
        const params = { uri: uri.toString(), position };
        client?.sendRequest("$/psi/select", params).then(result => {
            if (result) {
                this.post({
                    type: "psi_select",
                    value: result.data
                });
            }
        });
    }
    static onDidChangeTextDocument(event) {
        const activeEditor = vscode.window.activeTextEditor;
        const viewer = PsiViewer.currentPanel;
        if (activeEditor
            && activeEditor.document === event.document
            && activeEditor.document.languageId === LANGUAGE_ID) {
            viewer?.requestPsi(activeEditor);
        }
    }
    static onDidChangeActiveTextEditor(editor) {
        const viewer = PsiViewer.currentPanel;
        if (editor
            && editor.document.languageId === LANGUAGE_ID) {
            viewer?.requestPsi(editor);
        }
    }
    static onDidChangeSelection(e) {
        if (e.kind === vscode.TextEditorSelectionChangeKind.Mouse
            || e.kind === vscode.TextEditorSelectionChangeKind.Keyboard) {
            const viewer = PsiViewer.currentPanel;
            if (viewer) {
                viewer.requestPsiSelect(e.selections[0].start, e.textEditor.document.uri);
            }
        }
    }
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('lua.psi.view', () => {
        PsiViewer.createOrShow(context);
    }));
}
//# sourceMappingURL=psiViewer.js.map