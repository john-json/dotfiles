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
exports.WebVue = void 0;
const vscode = __importStar(require("vscode"));
const logging_service_1 = require("../services/logging.service");
const commands_1 = require("../commands");
const config_1 = require("../config");
const localLogger = (0, logging_service_1.createChildLogger)("WebVue");
const commandLogger = (0, logging_service_1.createChildLogger)("Command");
class WebVue {
    static currentPanel;
    _panel;
    _extensionUri;
    _disposables = [];
    constructor(context, panel) {
        const extensionUri = context.extensionUri;
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._panel.iconPath = {
            dark: vscode.Uri.joinPath(extensionUri, "images", "logo.png"),
            light: vscode.Uri.joinPath(extensionUri, "images", "logo.png"),
        };
        this._disposables.push(this._panel.onDidDispose(this.dispose, null, this._disposables), this._setWebviewMessageListener(this._panel.webview, context));
        this._panel.webview.html = this._getWebViewContent(this._panel.webview, context);
    }
    /** Convert a standard file uri to a uri usable by this webview. */
    toWebviewUri(pathList) {
        return this._panel.webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, ...pathList));
    }
    /** Send a message to the webview */
    static sendMessage(command, data) {
        WebVue.currentPanel?._panel.webview.postMessage({ command, data });
    }
    static sendNotification(message) {
        WebVue.sendMessage("notify", message);
    }
    /** Set the loading state of a store in the webview */
    static setLoadingState(loading) {
        WebVue.sendMessage("addonStore", {
            property: "loading",
            value: loading,
        });
    }
    /** Reveal or create a new panel in VS Code */
    static render(context) {
        const extensionUri = context.extensionUri;
        if (WebVue.currentPanel) {
            WebVue.currentPanel._panel.reveal(vscode.ViewColumn.One);
        }
        else {
            const panel = vscode.window.createWebviewPanel("lua-addon_manager", "Lua Addon Manager", vscode.ViewColumn.Active, {
                enableScripts: true,
                enableForms: false,
                localResourceRoots: [extensionUri],
            });
            WebVue.currentPanel = new WebVue(context, panel);
        }
        const workspaceOpen = vscode.workspace.workspaceFolders !== undefined &&
            vscode.workspace.workspaceFolders.length > 0;
        const clientVersion = context.extension.packageJSON.version;
        WebVue.sendMessage("appStore", {
            property: "workspaceState",
            value: workspaceOpen,
        });
        WebVue.sendMessage("appStore", {
            property: "clientVersion",
            value: clientVersion,
        });
        localLogger.debug(`Workspace Open: ${workspaceOpen}`);
    }
    /** Dispose of panel to clean up resources when it is closed */
    dispose() {
        WebVue.currentPanel = undefined;
        this._panel?.dispose();
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    /** Get the HTML content of the webview */
    _getWebViewContent(webview, context) {
        if (context.extensionMode !== vscode.ExtensionMode.Production) {
            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lua Addon Manager</title>
                <style>
                    html,body {
                        height: 100%;
                        display: block;
                        margin: 0;
                        padding: 0;
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        display: block;
                        border: none;
                        user-select: none;
                    }
                </style>
            </head>
            <body>
                <iframe src="${config_1.DEVELOPMENT_IFRAME_URL}"></iframe>
                <script>
                    const vscode = acquireVsCodeApi();

                    const devIframe = document.querySelector("iframe");
                    window.addEventListener("message", (message) => {
                        // If message is from VS Code


                        if (message.origin.startsWith("vscode-webview")) {
                            console.groupCollapsed("DEV: VS Code ➡️ WebVue");
                            console.log(message.data);
                            console.groupEnd();
                            devIframe.contentWindow.postMessage(message.data, devIframe.src)
                            return;
                        }

                        if (message.source === devIframe.contentWindow) {
                            console.groupCollapsed("DEV: WebVue ➡️ VS Code");
                            console.log(message.data);
                            console.groupEnd();
                            vscode.postMessage(message.data);
                            return;
                        }

                        console.error("Source unknown");
                        console.error(message);
                    })
                </script>
            </body>
            </html>
            `;
        }
        else {
            const stylesUri = this.toWebviewUri([
                "client",
                "webvue",
                "build",
                "assets",
                "index.css",
            ]);
            const scriptUri = this.toWebviewUri([
                "client",
                "webvue",
                "build",
                "assets",
                "index.js",
            ]);
            const codiconUri = this.toWebviewUri([
                "client",
                "webvue",
                "build",
                "assets",
                "codicon.ttf",
            ]);
            const inlineStyleNonce = this.getNonce();
            const scriptNonce = this.getNonce();
            return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${inlineStyleNonce}'; font-src ${webview.cspSource}; script-src 'nonce-${scriptNonce}';">
                <link rel="stylesheet" type="text/css" href="${stylesUri}">
                <title>Lua Addon Manager</title>
                <style nonce="${inlineStyleNonce}">
                    @font-face {
                        font-family: "codicon";
                        src: url(${codiconUri}) format("truetype");
                    }
                </style>
            </head>
            <body>
                <div id="app"></div>
                <script type="module" src="${scriptUri}" nonce="${scriptNonce}"></script>
            </body>
            </html>
            `;
        }
    }
    /** Get a `nonce` (number used once). Used for the content security policy.
     *
     * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)
     */
    getNonce() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    /** Sets up event listener for messages sent from webview */
    _setWebviewMessageListener(webview, context) {
        return webview.onDidReceiveMessage((message) => {
            const command = message.command;
            commandLogger.verbose(`Executing "${command}" (${JSON.stringify(message)})`);
            try {
                commands_1.commands[command](context, message);
            }
            catch (e) {
                commandLogger.error(e);
            }
        });
    }
}
exports.WebVue = WebVue;
//# sourceMappingURL=WebVue.js.map