"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryLog = exports.initializeTelemetryReporter = void 0;
// telemetry.ts
const vscode = require("vscode");
const extension_telemetry_1 = require("@vscode/extension-telemetry");
const connectionString = 'InstrumentationKey=0a5f6d36-ee92-43e4-9b19-af4a82b3b386;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/;ApplicationId=97be5a27-1a4f-4c65-98c4-79c3e1371155';
let reporter;
// Initialize once in your extension's activate function
function initializeTelemetryReporter(context) {
    reporter = new extension_telemetry_1.default(connectionString);
    context.subscriptions.push(reporter);
}
exports.initializeTelemetryReporter = initializeTelemetryReporter;
function TelemetryLog(type, message, extraProperties = {}) {
    if (!reporter) {
        console.warn('Telemetry not initialized. Call init() first.');
        return;
    }
    const workspaceType = vscode.workspace.workspaceFolders
        ? (vscode.workspace.workspaceFolders.length > 1 ? 'multi-root' : 'single-root')
        : 'no-workspace';
    const properties = {
        message,
        workspaceType,
        timestamp: new Date().toISOString(),
        ...extraProperties
    };
    if (type === 'error') {
        reporter.sendTelemetryErrorEvent(type, properties);
    }
    else {
        reporter.sendTelemetryEvent(type, properties);
    }
}
exports.TelemetryLog = TelemetryLog;
// usage:
// import { initializeTelemetryReporter, TelemetryLog } from './telemetry';
//
// export function activate(context: vscode.ExtensionContext) {
//     initializeTelemetryReporter(context);
//
//     TelemetryLog('info', 'Extension activated');
//# sourceMappingURL=telemetry.js.map