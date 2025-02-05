"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const versionSelector_1 = require("./versionSelector");
const vscode_languageclient_1 = require("vscode-languageclient");
function activate(context) {
    startLanguageServer(context);
    context.subscriptions.push(new versionSelector_1.VersionSelector());
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;
function startLanguageServer(context) {
    const serverModule = path.join(__dirname, '../server', 'main.js');
    const debugOptions = {
        execArgv: ['--nolazy', '--inspect=6009'], env: {
            NODE_ENV: 'development'
        }
    };
    const runOptions = {
        env: {
            NODE_ENV: 'production'
        }
    };
    const serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc, options: runOptions },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            runtime: 'node',
            options: debugOptions
        }
    };
    const clientOptions = {
        documentSelector: [
            { language: 'lua', scheme: 'file' },
            { language: 'lua', scheme: 'untitled' }
        ],
        synchronize: {
            configurationSection: [
                'lua'
            ]
        }
    };
    const disposable = new vscode_languageclient_1.LanguageClient('luaLanguageServer', 'Lua Language Server', serverOptions, clientOptions).start();
    context.subscriptions.push(disposable);
}
//# sourceMappingURL=extension.js.map