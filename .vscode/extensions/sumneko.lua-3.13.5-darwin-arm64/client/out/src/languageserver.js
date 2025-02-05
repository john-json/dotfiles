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
exports.createClient = exports.defaultClient = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
exports.reportAPIDoc = reportAPIDoc;
exports.setConfig = setConfig;
exports.getConfig = getConfig;
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const vscode = __importStar(require("vscode"));
const LSP = __importStar(require("vscode-languageserver-protocol"));
const vscode_1 = require("vscode");
const node_1 = require("vscode-languageclient/node");
function registerCustomCommands(context) {
    context.subscriptions.push(vscode_1.commands.registerCommand('lua.config', (changes) => {
        const propMap = {};
        for (const data of changes) {
            const config = vscode_1.workspace.getConfiguration(undefined, vscode_1.Uri.parse(data.uri));
            if (data.action === 'add') {
                const value = config.get(data.key);
                if (!Array.isArray(value))
                    throw new Error(`${data.key} is not an Array!`);
                value.push(data.value);
                config.update(data.key, value, data.global);
                continue;
            }
            if (data.action === 'set') {
                config.update(data.key, data.value, data.global);
                continue;
            }
            if (data.action === 'prop') {
                if (!propMap[data.key]) {
                    let prop = config.get(data.key);
                    if (typeof prop === 'object' && prop !== null) {
                        propMap[data.key] = prop;
                    }
                }
                propMap[data.key][data.prop] = data.value;
                config.update(data.key, propMap[data.key], data.global);
                continue;
            }
        }
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('lua.exportDocument', async () => {
        if (!exports.defaultClient) {
            return;
        }
        const outputs = await vscode.window.showOpenDialog({
            defaultUri: vscode.Uri.joinPath(context.extensionUri, 'server', 'log'),
            openLabel: "Export to this folder",
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
        });
        const output = outputs?.[0];
        if (!output) {
            return;
        }
        exports.defaultClient.client?.sendRequest(node_1.ExecuteCommandRequest.type, {
            command: 'lua.exportDocument',
            arguments: [output.toString()],
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('lua.reloadFFIMeta', async () => {
        exports.defaultClient?.client?.sendRequest(node_1.ExecuteCommandRequest.type, {
            command: 'lua.reloadFFIMeta',
        });
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('lua.startServer', async () => {
        deactivate();
        (0, exports.createClient)(context);
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('lua.stopServer', async () => {
        deactivate();
    }));
    context.subscriptions.push(vscode_1.commands.registerCommand('lua.showReferences', (uri, position, locations) => {
        vscode.commands.executeCommand('editor.action.showReferences', vscode.Uri.parse(uri), new vscode.Position(position.line, position.character), locations.map((value) => {
            return new vscode.Location(vscode.Uri.parse(value.uri), new vscode.Range(value.range.start.line, value.range.start.character, value.range.end.line, value.range.end.character));
        }));
    }));
}
/** Creates a new {@link LuaClient} and starts it. */
const createClient = (context) => {
    exports.defaultClient = new LuaClient(context, [{ language: 'lua' }]);
    exports.defaultClient.start();
};
exports.createClient = createClient;
class LuaClient extends vscode_1.Disposable {
    context;
    documentSelector;
    client;
    disposables = new Array();
    constructor(context, documentSelector) {
        super(() => {
            for (const disposable of this.disposables) {
                disposable.dispose();
            }
        });
        this.context = context;
        this.documentSelector = documentSelector;
    }
    async start() {
        // Options to control the language client
        const clientOptions = {
            // Register the server for plain text documents
            documentSelector: this.documentSelector,
            progressOnInitialization: true,
            markdown: {
                isTrusted: true,
                supportHtml: true,
            },
            initializationOptions: {
                changeConfiguration: true,
                statusBar: true,
                viewDocument: true,
                trustByClient: true,
                useSemanticByRange: true,
                codeLensViewReferences: true,
                fixIndents: true,
                languageConfiguration: true,
                storagePath: this.context.globalStorageUri.fsPath,
            },
            middleware: {
                provideHover: async () => undefined,
            }
        };
        const config = vscode_1.workspace.getConfiguration(undefined, vscode.workspace.workspaceFolders?.[0]);
        const commandParam = config.get("Lua.misc.parameters");
        const command = await this.getCommand(config);
        if (!Array.isArray(commandParam))
            throw new Error("Lua.misc.parameters must be an Array!");
        const port = this.getPort(commandParam);
        const serverOptions = {
            command: command,
            transport: port
                ? {
                    kind: node_1.TransportKind.socket,
                    port: port,
                }
                : undefined,
            args: commandParam,
        };
        this.client = new node_1.LanguageClient("Lua", "Lua", serverOptions, clientOptions);
        this.disposables.push(this.client);
        //client.registerProposedFeatures();
        await this.client.start();
        this.onCommand();
        this.statusBar();
        this.languageConfiguration();
        this.provideHover();
    }
    async getCommand(config) {
        const executablePath = config.get("Lua.misc.executablePath");
        if (typeof executablePath !== "string")
            throw new Error("Lua.misc.executablePath must be a string!");
        if (executablePath && executablePath !== "") {
            return executablePath;
        }
        const platform = os.platform();
        let command;
        let binDir;
        if ((await fs.promises.stat(this.context.asAbsolutePath("server/bin"))).isDirectory()) {
            binDir = "bin";
        }
        switch (platform) {
            case "win32":
                command = this.context.asAbsolutePath(path.join("server", binDir ? binDir : "bin-Windows", "lua-language-server.exe"));
                break;
            case "linux":
                command = this.context.asAbsolutePath(path.join("server", binDir ? binDir : "bin-Linux", "lua-language-server"));
                await fs.promises.chmod(command, "777");
                break;
            case "darwin":
                command = this.context.asAbsolutePath(path.join("server", binDir ? binDir : "bin-macOS", "lua-language-server"));
                await fs.promises.chmod(command, "777");
                break;
            default:
                throw new Error(`Unsupported operating system "${platform}"!`);
        }
        return command;
    }
    // Generated by Copilot
    getPort(commandParam) {
        // "--socket=xxxx" or "--socket xxxx"
        const portIndex = commandParam.findIndex((value) => {
            return value.startsWith("--socket");
        });
        if (portIndex === -1) {
            return undefined;
        }
        const port = commandParam[portIndex].split("=")[1] ||
            commandParam[portIndex].split(" ")[1] ||
            commandParam[portIndex + 1];
        if (!port) {
            return undefined;
        }
        return Number(port);
    }
    async stop() {
        this.client?.stop();
        this.dispose();
    }
    statusBar() {
        const client = this.client;
        const bar = vscode_1.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
        bar.text = "Lua";
        bar.command = "Lua.statusBar";
        this.disposables.push(vscode_1.commands.registerCommand(bar.command, () => {
            client.sendNotification("$/status/click");
        }));
        this.disposables.push(client.onNotification("$/status/show", () => {
            bar.show();
        }));
        this.disposables.push(client.onNotification("$/status/hide", () => {
            bar.hide();
        }));
        this.disposables.push(client.onNotification("$/status/report", (params) => {
            bar.text = params.text;
            bar.tooltip = params.tooltip;
        }));
        client.sendNotification("$/status/refresh");
        this.disposables.push(bar);
    }
    onCommand() {
        if (!this.client) {
            return;
        }
        this.disposables.push(this.client.onNotification("$/command", (params) => {
            vscode_1.commands.executeCommand(params.command, params.data);
        }));
    }
    languageConfiguration() {
        if (!this.client) {
            return;
        }
        function convertStringsToRegex(config) {
            if (typeof config !== 'object' || config === null) {
                return config;
            }
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    const value = config[key];
                    if (typeof value === 'object' && value !== null) {
                        convertStringsToRegex(value);
                    }
                    if (key === 'beforeText' || key === 'afterText') {
                        if (typeof value === 'string') {
                            config[key] = new RegExp(value);
                        }
                    }
                }
            }
            return config;
        }
        let configuration;
        this.disposables.push(this.client.onNotification('$/languageConfiguration', (params) => {
            configuration?.dispose();
            configuration = vscode.languages.setLanguageConfiguration(params.id, convertStringsToRegex(params.configuration));
            this.disposables.push(configuration);
        }));
    }
    provideHover() {
        const client = this.client;
        const levelMap = new WeakMap();
        let provider = vscode.languages.registerHoverProvider('lua', {
            provideHover: async (document, position, token, context) => {
                if (!client) {
                    return null;
                }
                let level = 1;
                if (context?.previousHover) {
                    level = levelMap.get(context.previousHover) ?? 0;
                    if (context.verbosityDelta !== undefined) {
                        level += context.verbosityDelta;
                    }
                }
                let params = {
                    level: level,
                    ...client.code2ProtocolConverter.asTextDocumentPositionParams(document, position),
                };
                return client?.sendRequest(LSP.HoverRequest.type, params, token).then((result) => {
                    if (token.isCancellationRequested) {
                        return null;
                    }
                    if (result === null) {
                        return null;
                    }
                    let verboseResult = result;
                    let maxLevel = verboseResult.maxLevel ?? 0;
                    let hover = client.protocol2CodeConverter.asHover(result);
                    let verboseHover = new vscode.VerboseHover(hover.contents, hover.range, level < maxLevel, level > 0);
                    if (level > maxLevel) {
                        level = maxLevel;
                    }
                    levelMap.set(verboseHover, level);
                    return verboseHover;
                }, (error) => {
                    return client.handleFailedRequest(LSP.HoverRequest.type, token, error, null);
                });
            }
        });
        this.disposables.push(provider);
    }
}
function activate(context) {
    registerCustomCommands(context);
    function didOpenTextDocument(document) {
        // We are only interested in language mode text
        if (document.languageId !== 'lua') {
            return;
        }
        // Untitled files go to a default client.
        if (!exports.defaultClient) {
            (0, exports.createClient)(context);
            return;
        }
    }
    vscode_1.workspace.onDidOpenTextDocument(didOpenTextDocument);
    vscode_1.workspace.textDocuments.forEach(didOpenTextDocument);
}
async function deactivate() {
    if (exports.defaultClient) {
        exports.defaultClient.stop();
        exports.defaultClient.dispose();
        exports.defaultClient = null;
    }
    return undefined;
}
vscode.SyntaxTokenType.String;
async function reportAPIDoc(params) {
    if (!exports.defaultClient) {
        return;
    }
    exports.defaultClient.client?.sendNotification('$/api/report', params);
}
async function setConfig(changes) {
    if (!exports.defaultClient) {
        return false;
    }
    const params = [];
    for (const change of changes) {
        params.push({
            action: change.action,
            prop: (change.action === "prop") ? change.prop : undefined,
            key: change.key,
            value: change.value,
            uri: change.uri.toString(),
            global: change.global,
        });
    }
    await exports.defaultClient.client?.sendRequest(node_1.ExecuteCommandRequest.type, {
        command: 'lua.setConfig',
        arguments: params,
    });
    return true;
}
async function getConfig(key, uri) {
    if (!exports.defaultClient) {
        return undefined;
    }
    return await exports.defaultClient.client?.sendRequest(node_1.ExecuteCommandRequest.type, {
        command: 'lua.getConfig',
        arguments: [{
                uri: uri.toString(),
                key: key,
            }]
    });
}
//# sourceMappingURL=languageserver.js.map