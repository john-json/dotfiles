"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
exports.Manager = void 0;
const dispose_1 = require("./utils/dispose");
const vscode = __importStar(require("vscode"));
const pathUtil_1 = require("./utils/pathUtil");
const connectionManager_1 = require("./connectionInfo/connectionManager");
const browserPreview_1 = require("./editorPreview/browserPreview");
const settingsUtil_1 = require("./utils/settingsUtil");
const serverTaskProvider_1 = require("./task/serverTaskProvider");
const endpointManager_1 = require("./infoManagers/endpointManager");
const previewManager_1 = require("./editorPreview/previewManager");
const statusBarNotifier_1 = require("./server/serverUtils/statusBarNotifier");
const constants_1 = require("./utils/constants");
const serverGrouping_1 = require("./server/serverGrouping");
const updateListener_1 = require("./updateListener");
const url_1 = require("url");
/**
 * This object re-serializes the webview after a reload
 */
class PanelSerializer extends dispose_1.Disposable {
    constructor() {
        super(...arguments);
        this._onShouldRevive = this._register(new vscode.EventEmitter());
        this.onShouldRevive = this._onShouldRevive.event;
    }
    deserializeWebviewPanel(webviewPanel, state) {
        // fire event to parent, since all info needed to re-open a panel is in the parent
        this._onShouldRevive.fire({ webviewPanel, state });
        return Promise.resolve();
    }
}
/**
 * `Manager` is a singleton instance that managers all of the servers, the previews, connection info, etc.
 * It also facilitates opening files (sometimes by calling `PreviewManager`) and starting the associated servers.
 */
class Manager extends dispose_1.Disposable {
    constructor(_extensionUri, _reporter, _userDataDir) {
        super();
        this._extensionUri = _extensionUri;
        this._reporter = _reporter;
        this._serverGroupings = new Map();
        this._pendingServerWorkspaces = new Set();
        this._connectionManager = this._register(new connectionManager_1.ConnectionManager());
        this._register(this._connectionManager.onConnected((e) => {
            var _a;
            this._statusBar.setServer((_a = e.workspace) === null || _a === void 0 ? void 0 : _a.uri, e.httpPort);
            vscode.commands.executeCommand('setContext', constants_1.LIVE_PREVIEW_SERVER_ON, true);
        }));
        this._endpointManager = this._register(new endpointManager_1.EndpointManager());
        this._previewManager = this._register(new previewManager_1.PreviewManager(this._extensionUri, this._reporter, this._connectionManager, this._endpointManager, () => {
            var _a;
            if (this._hasServerRunning() &&
                !this._serverTaskProvider.isRunning &&
                vscode.workspace.workspaceFolders &&
                ((_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a.length) > 0 &&
                this._serverTaskProvider.runTaskWithExternalPreview) {
                this.closeAllServers();
            }
        }));
        this._statusBar = this._register(new statusBarNotifier_1.StatusBarNotifier());
        this._serverTaskProvider = this._register(new serverTaskProvider_1.ServerTaskProvider(this._reporter, this._endpointManager, this._connectionManager));
        this._register(vscode.tasks.registerTaskProvider(serverTaskProvider_1.ServerTaskProvider.CustomBuildScriptType, this._serverTaskProvider));
        this._register(this._serverTaskProvider.onRequestOpenEditorToSide((uri) => {
            var _a;
            if (this._previewManager.previewActive &&
                this._previewManager.currentPanel) {
                const avoidColumn = (_a = this._previewManager.currentPanel.panel.viewColumn) !== null && _a !== void 0 ? _a : vscode.ViewColumn.One;
                const column = avoidColumn == vscode.ViewColumn.One
                    ? avoidColumn + 1
                    : avoidColumn - 1;
                vscode.commands.executeCommand('vscode.open', uri, {
                    viewColumn: column,
                });
            }
            else {
                vscode.commands.executeCommand('vscode.open', uri);
            }
        }));
        this._register(this._serverTaskProvider.onRequestToOpenServer(async (workspace) => {
            const serverGrouping = await this._getServerGroupingFromWorkspace(workspace);
            if (!serverGrouping.isRunning) {
                await serverGrouping.openServer();
            }
            else {
                const uri = await serverGrouping.connection.resolveExternalHTTPUri();
                this._serverTaskProvider.serverStarted(uri, serverTaskProvider_1.ServerStartedStatus.STARTED_BY_EMBEDDED_PREV, serverGrouping.connection.workspace);
            }
        }));
        this._register(this._serverTaskProvider.onRequestToCloseServer((workspace) => {
            if (this._previewManager.previewActive) {
                this._serverTaskProvider.serverStop(false, workspace);
            }
            else {
                const serverGrouping = this._serverGroupings.get(workspace === null || workspace === void 0 ? void 0 : workspace.uri.toString());
                // closeServer will call `this._serverTaskProvider.serverStop(true, workspace);`
                serverGrouping === null || serverGrouping === void 0 ? void 0 : serverGrouping.dispose();
            }
        }));
        const serializer = this._register(new PanelSerializer());
        this._register(serializer.onShouldRevive(async (e) => {
            var _a;
            let relative = false;
            let file = (_a = e.state.currentAddress) !== null && _a !== void 0 ? _a : '/';
            let workspace = await pathUtil_1.PathUtil.GetWorkspaceFromRelativePath(file);
            if (workspace) {
                relative = true;
            }
            else {
                // path isn't relative to workspaces, try checking absolute path for workspace
                workspace = await pathUtil_1.PathUtil.GetWorkspaceFromAbsolutePath(file);
            }
            if (!workspace) {
                // no workspace; try to decode endpoint to fix file
                const potentialFile = await this._endpointManager.decodeLooseFileEndpoint(file);
                if (potentialFile) {
                    file = potentialFile;
                }
                else {
                    e.webviewPanel.dispose();
                    return;
                }
            }
            let fileUri;
            // loose file workspace will be fetched if workspace is still undefined
            const grouping = await this._getServerGroupingFromWorkspace(workspace);
            if (workspace) {
                // PathExistsRelativeToAnyWorkspace already makes sure that file is under correct root prefix
                fileUri = vscode.Uri.joinPath(workspace.uri, await pathUtil_1.PathUtil.GetValidServerRootForWorkspace(workspace), file);
            }
            else {
                fileUri = vscode.Uri.parse(file);
            }
            grouping.createOrShowEmbeddedPreview(e.webviewPanel, fileUri, relative);
            e.webviewPanel.webview.options =
                this._previewManager.getWebviewOptions();
        }));
        if (vscode.window.registerWebviewPanelSerializer) {
            this._register(vscode.window.registerWebviewPanelSerializer(browserPreview_1.BrowserPreview.viewType, serializer));
        }
        this._register(vscode.workspace.onDidChangeWorkspaceFolders((e) => {
            if (e.removed) {
                e.removed.forEach((workspace) => {
                    const potentialGrouping = this._serverGroupings.get(workspace.uri.toString());
                    if (potentialGrouping) {
                        potentialGrouping.dispose();
                    }
                });
            }
            // known bug: transitioning between 1 and 2 workspaces: https://github.com/microsoft/vscode/issues/128138
        }));
        this._register(this._serverTaskProvider.onShouldLaunchPreview((e) => {
            if (e.uri && e.uri.scheme !== 'file') {
                this._openPreviewAtLink(e.uri, e.previewType);
            }
            else {
                this.openPreviewAtFileUri(e.uri, e.options, e.previewType);
            }
        }));
        this._register(this._previewManager.onShouldLaunchPreview((e) => {
            if (e.uri && e.uri.scheme !== 'file') {
                this._openPreviewAtLink(e.uri, e.previewType);
            }
            else {
                this.openPreviewAtFileUri(e.uri, e.options, e.previewType);
            }
        }));
        this._updateListener = this._register(new updateListener_1.UpdateListener(_userDataDir));
        this._register(this._updateListener.shouldRefreshPreviews(() => this._refreshBrowsers()));
    }
    async forceCloseServers() {
        if (this._serverGroupings.size > 1) {
            this._showCloseServerPicker();
        }
        else {
            this.closeAllServers();
        }
    }
    /**
     * Close all servers
     */
    closeAllServers() {
        this._serverGroupings.forEach((serverGrouping) => {
            serverGrouping.dispose();
        });
    }
    dispose() {
        this.closeAllServers();
        super.dispose();
    }
    closePanel() {
        var _a;
        (_a = this._previewManager.currentPanel) === null || _a === void 0 ? void 0 : _a.close();
    }
    /**
     * Gets called when someone calls `LivePreview.start`. Will simply use the default initial file that you've set.
     */
    async openPreview() {
        var _a, _b;
        const activeFile = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
        const activeWorkspace = activeFile ? vscode.workspace.getWorkspaceFolder(activeFile) : (_b = vscode.workspace.workspaceFolders) === null || _b === void 0 ? void 0 : _b[0];
        // use the active workspace folder. otherwise, use the first workspace folder.
        let defaultPreviewPath = settingsUtil_1.SettingUtil.GetConfig(activeWorkspace).defaultPreviewPath;
        // if this gave no results, still try to use the the preview path from other settings, but appended to the active workspace
        // otherwise, still use the active workspace, but with no default path.
        if (defaultPreviewPath === '') {
            defaultPreviewPath = settingsUtil_1.SettingUtil.GetConfig().defaultPreviewPath;
        }
        // defaultPreviewPath is relative to the workspace root, regardless of what is set for serverRoot
        return this.openPreviewAtFileString(defaultPreviewPath, undefined, activeWorkspace, true);
    }
    /**
     * Using only a string path (unknown if relative or absolute), launch the preview or launch an error.
     * This is usually used for when the user configures a setting for initial filepath
     * @param filePath the string fsPath to use
     */
    async openPreviewAtFileString(filePath, previewType, activeWorkspace, ignoreFileRoot = false) {
        if (filePath === '' && !activeWorkspace) {
            return this._openPreviewWithNoTarget();
        }
        const workspace = activeWorkspace ? activeWorkspace : await pathUtil_1.PathUtil.GetWorkspaceFromRelativePath(filePath, ignoreFileRoot);
        if (workspace) {
            const file = vscode.Uri.joinPath(workspace.uri, ignoreFileRoot ? '' : await pathUtil_1.PathUtil.GetValidServerRootForWorkspace(workspace), filePath);
            await this.openPreviewAtFileUri(file, {
                workspace: workspace,
            }, previewType);
            return;
        }
        // no workspace, try to open as a loose file
        if ((await pathUtil_1.PathUtil.FileExistsStat(filePath)).exists) {
            const file = vscode.Uri.file(filePath);
            return this.openPreviewAtFileUri(file, undefined, previewType);
        }
        else {
            vscode.window.showWarningMessage(vscode.l10n.t("The file '{0}' does not exist relative your filesystem root.", filePath));
            return this._openPreviewWithNoTarget();
        }
    }
    async openPreviewAtFileUri(file, options, previewType) {
        var _a, _b;
        let fileUri;
        if (!file) {
            if ((_a = this._previewManager.currentPanel) === null || _a === void 0 ? void 0 : _a.panel.active) {
                if (this._previewManager.currentPanel.currentConnection.rootURI) {
                    fileUri = vscode.Uri.joinPath(this._previewManager.currentPanel.currentConnection.rootURI, this._previewManager.currentPanel.currentAddress);
                }
                else {
                    fileUri = vscode.Uri.parse(this._previewManager.currentPanel.currentAddress);
                }
            }
            else {
                const activeFile = (_b = vscode.window.activeTextEditor) === null || _b === void 0 ? void 0 : _b.document.uri;
                if (activeFile) {
                    fileUri = activeFile;
                }
                else {
                    return this._openPreviewWithNoTarget();
                }
            }
        }
        else {
            fileUri = file;
        }
        if (!previewType) {
            previewType = settingsUtil_1.SettingUtil.GetPreviewType();
        }
        const internal = previewType === settingsUtil_1.PreviewType.internalPreview;
        const debug = previewType === settingsUtil_1.PreviewType.externalDebugPreview;
        return await this._handleOpenFile(internal, debug, fileUri, options === null || options === void 0 ? void 0 : options.workspace, options === null || options === void 0 ? void 0 : options.port, options === null || options === void 0 ? void 0 : options.manager);
    }
    /**
 * Runs task for workspace from within extension. Must have at least one workspace open.
 * @param file optional file to use to find the workspace to run the task out of.
 * @returns
 */
    async runTaskForFile(file) {
        var _a, _b, _c;
        if (!file) {
            file = (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
        }
        let workspace;
        if (file) {
            workspace = await pathUtil_1.PathUtil.GetWorkspaceFromURI(file);
        }
        else if (vscode.workspace.workspaceFolders &&
            ((_b = vscode.workspace.workspaceFolders) === null || _b === void 0 ? void 0 : _b.length) > 0) {
            if (this._serverGroupings.size > 0) {
                const matchGrouping = Array.from(this._serverGroupings.values()).find((grouping) => grouping.workspace && grouping.isRunning);
                workspace =
                    (_c = matchGrouping === null || matchGrouping === void 0 ? void 0 : matchGrouping.workspace) !== null && _c !== void 0 ? _c : vscode.workspace.workspaceFolders[0];
            }
            else {
                workspace = vscode.workspace.workspaceFolders[0];
            }
        }
        if (!workspace) {
            return; // fails preconditions of being in a workspace
        }
        return await this._serverTaskProvider.extRunTask(workspace);
    }
    /**
     * Show the picker to select a server to close
     */
    async _showCloseServerPicker() {
        const disposables = [];
        const quickPick = vscode.window.createQuickPick();
        disposables.push(quickPick);
        quickPick.matchOnDescription = true;
        quickPick.placeholder = vscode.l10n.t('Select the port that corresponds to the server that you want to stop');
        quickPick.items = await this._getServerPicks();
        disposables.push(quickPick.onDidAccept(() => {
            const selectedItem = quickPick.selectedItems[0];
            selectedItem.accept();
            quickPick.hide();
            disposables.forEach((d) => d.dispose());
        }));
        quickPick.show();
    }
    /**
 * Opens a preview at an internal link that has the format <scheme>://<host>:<port>/<path>
 * @param link
 * @param previewType
 */
    async _openPreviewAtLink(link, previewType) {
        const debug = previewType === settingsUtil_1.PreviewType.externalDebugPreview;
        const internal = this._isInternalPreview(previewType);
        try {
            if (link.scheme !== 'https' && link.scheme !== 'http') {
                console.error(`${link.scheme} does not correspond to a link URI`);
                throw Error;
            }
            const pathStr = `${link.scheme}://${link.authority}`;
            const url = new url_1.URL(pathStr);
            const port = parseInt(url.port);
            const connection = this._connectionManager.getConnectionFromPort(port);
            if (!connection) {
                // don't have any workspace info, just treat it as relative path
                return this.openPreviewAtFileString(link.path, previewType);
            }
            const serverGrouping = await this._getServerGroupingFromWorkspace(connection.workspace);
            if (!connection.rootURI) {
                // using server grouping with undefined workspace
                return this._openPreview(internal, serverGrouping, vscode.Uri.file(this._endpointManager.changePrefixesForAbsPathDecode(link.path)), debug);
            }
            const file = connection.getAppendedURI(link.path);
            this._openPreview(internal, serverGrouping, file, debug);
        }
        catch (e) {
            vscode.window.showErrorMessage(vscode.l10n.t('badURL', 'Tried to open preview on invalid URI'));
        }
    }
    /**
     * handles opening a file
     * @param internal whether to launch an embedded preview
     * @param file the uri or string filePath to use
     * @param fileStringRelative whether the path is relative
     * @param debug whether to launch in debug
     * @param workspace the workspace to launch the file from
     * @param port the port to derive the workspace from
     * @param serverGrouping the serverGrouping that manages the server workspace
     */
    async _handleOpenFile(internal, debug, file, workspace, port, serverGrouping) {
        if (file.scheme !== 'file') {
            console.error('Tried to open a non-file URI with file opener');
        }
        if (!serverGrouping) {
            if (workspace) {
                serverGrouping = await this._getServerGroupingFromWorkspace(await this._shouldUseWorkspaceForFile(workspace, file) ? workspace : undefined);
            }
            else if (port) {
                this._serverGroupings.forEach((potentialServerGrouping) => {
                    if (potentialServerGrouping.port === port) {
                        serverGrouping = potentialServerGrouping;
                        return;
                    }
                });
            }
            else {
                workspace = await pathUtil_1.PathUtil.GetWorkspaceFromURI(file);
                serverGrouping = await this._getServerGroupingFromWorkspace(workspace);
            }
        }
        if (!serverGrouping) {
            // last-resort: use loose workspace server.
            serverGrouping = await this._getServerGroupingFromWorkspace(undefined);
        }
        return this._openPreview(internal, serverGrouping, file, debug);
    }
    _refreshBrowsers() {
        Array.from(this._serverGroupings.values()).forEach((grouping) => {
            grouping.refresh();
        });
    }
    async _shouldUseWorkspaceForFile(workspace, file) {
        if (!workspace) {
            // never use the root prefix path on non-workspace paths
            return false;
        }
        const serverRootPrefix = await pathUtil_1.PathUtil.GetValidServerRootForWorkspace(workspace);
        if (serverRootPrefix === '') {
            return true;
        }
        if (file) {
            const workspaceURIWithServerRoot = vscode.Uri.joinPath(workspace.uri, serverRootPrefix);
            if (workspaceURIWithServerRoot) {
                if (file.fsPath.startsWith(workspaceURIWithServerRoot.fsPath)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Creates a serverGrouping and connection object for a workspace if it doesn't already have an existing one.
     * Otherwise, return the existing serverGrouping.
     * @param workspace
     * @returns serverGrouping for this workspace (or, when `workspace == undefined`, the serverGrouping for the loose file workspace)
     */
    async _getServerGroupingFromWorkspace(workspace) {
        let serverGrouping = this._serverGroupings.get(workspace === null || workspace === void 0 ? void 0 : workspace.uri.toString());
        if (!serverGrouping) {
            const connection = await this._connectionManager.createAndAddNewConnection(workspace);
            this._register(connection.onConnected(() => {
                this._pendingServerWorkspaces.delete(workspace === null || workspace === void 0 ? void 0 : workspace.uri.toString());
            }));
            serverGrouping = this._register(new serverGrouping_1.ServerGrouping(this._extensionUri, this._reporter, this._endpointManager, connection, this._serverTaskProvider, this._pendingServerWorkspaces));
            this._register(serverGrouping.onClose(() => {
                var _a;
                if (this._previewManager.currentPanel &&
                    this._previewManager.currentPanel.currentConnection === connection) {
                    // close the preview if it is showing this server's content
                    (_a = this._previewManager.currentPanel) === null || _a === void 0 ? void 0 : _a.close();
                }
                this._statusBar.removeServer(workspace === null || workspace === void 0 ? void 0 : workspace.uri);
                this._serverGroupings.delete(workspace === null || workspace === void 0 ? void 0 : workspace.uri.toString());
                if (this._serverGroupings.size === 0) {
                    this._statusBar.serverOff();
                    vscode.commands.executeCommand('setContext', constants_1.LIVE_PREVIEW_SERVER_ON, false);
                }
                this._connectionManager.removeConnection(workspace);
            }));
            this._register(serverGrouping.onShouldLaunchEmbeddedPreview((e) => this._previewManager.launchFileInEmbeddedPreview(e.panel, e.connection, e.uri)));
            this._register(serverGrouping.onShouldLaunchExternalPreview((e) => this._previewManager.launchFileInExternalBrowser(e.debug, e.connection, e.uri)));
            this._serverGroupings.set(workspace === null || workspace === void 0 ? void 0 : workspace.uri.toString(), serverGrouping);
        }
        return serverGrouping;
    }
    async _openPreview(internal, serverGrouping, file, debug = false) {
        if (internal) {
            // for now, ignore debug or no debug for embedded preview
            await serverGrouping.createOrShowEmbeddedPreview(undefined, file);
        }
        else {
            await serverGrouping.showPreviewInExternalBrowser(debug, file);
        }
    }
    _hasServerRunning() {
        const isRunning = Array.from(this._serverGroupings.values()).filter((group) => group.isRunning);
        return isRunning.length !== 0;
    }
    _isInternalPreview(previewType) {
        if (!previewType) {
            previewType = settingsUtil_1.SettingUtil.GetPreviewType();
        }
        return previewType === settingsUtil_1.PreviewType.internalPreview;
    }
    async _openPreviewWithNoTarget() {
        // Opens index at first open server or opens a loose workspace at root.
        // This function is called with the assumption that there might be an open server already
        // and we should check.
        const internal = this._isInternalPreview();
        const workspaces = vscode.workspace.workspaceFolders;
        if (workspaces && workspaces.length > 0) {
            for (let i = 0; i < workspaces.length; i++) {
                const currWorkspace = workspaces[i];
                const manager = this._serverGroupings.get(currWorkspace.uri.toString());
                if (manager) {
                    this.openPreviewAtFileUri(undefined, {
                        workspace: currWorkspace,
                        manager: manager,
                    });
                    return;
                }
            }
            const grouping = await this._getServerGroupingFromWorkspace(workspaces[0]);
            this._openPreview(internal, grouping, undefined);
        }
        else {
            const grouping = await this._getServerGroupingFromWorkspace(undefined);
            this._openPreview(internal, grouping, undefined);
        }
    }
    async _getServerPicks() {
        const serverPicks = [];
        const picks = await Promise.all(Array.from(this._serverGroupings.values()).map((grouping) => this._getServerPickFromGrouping(grouping)));
        picks.forEach((pick) => {
            if (pick) {
                serverPicks.push(pick);
            }
        });
        if (picks.length > 0) {
            serverPicks.push({
                label: vscode.l10n.t('All Servers'),
                accept: () => this.closeAllServers(),
            });
        }
        return serverPicks;
    }
    _getServerPickFromGrouping(grouping) {
        var _a, _b;
        const connection = this._connectionManager.getConnection(grouping.workspace);
        if (!connection) {
            return;
        }
        return {
            label: `$(radio-tower) ${connection.httpPort}`,
            description: (_b = (_a = grouping.workspace) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : vscode.l10n.t('non-workspace files'),
            accept: () => {
                grouping.dispose();
            },
        };
    }
}
exports.Manager = Manager;
//# sourceMappingURL=manager.js.map