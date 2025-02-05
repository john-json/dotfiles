"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
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
const https = __importStar(require("https"));
const os = __importStar(require("os"));
const vscode = __importStar(require("vscode"));
const _1dsClientFactory_1 = require("../common/1dsClientFactory");
const appInsightsClientFactory_1 = require("../common/appInsightsClientFactory");
const baseTelemetryReporter_1 = require("../common/baseTelemetryReporter");
const baseTelemetrySender_1 = require("../common/baseTelemetrySender");
const util_1 = require("../common/util");
/**
 * Create a replacement for the XHTMLRequest object utilizing nodes HTTP module.
 * @returns A XHR override object used to override the XHTMLRequest object in the 1DS SDK
 */
function getXHROverride() {
    // Override the way events get sent since node doesn't have XHTMLRequest
    const customHttpXHROverride = {
        sendPOST: (payload, oncomplete) => {
            const options = {
                method: "POST",
                headers: {
                    ...payload.headers,
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(payload.data)
                }
            };
            try {
                const req = https.request(payload.urlString, options, res => {
                    res.on("data", function (responseData) {
                        oncomplete(res.statusCode ?? 200, res.headers, responseData.toString());
                    });
                    // On response with error send status of 0 and a blank response to oncomplete so we can retry events
                    res.on("error", function () {
                        oncomplete(0, {});
                    });
                });
                req.write(payload.data, (err) => {
                    if (err) {
                        oncomplete(0, {});
                    }
                });
                req.end();
            }
            catch {
                // If it errors out, send status of 0 and a blank response to oncomplete so we can retry events
                oncomplete(0, {});
            }
        }
    };
    return customHttpXHROverride;
}
class TelemetryReporter extends baseTelemetryReporter_1.BaseTelemetryReporter {
    constructor(connectionString, replacementOptions) {
        let clientFactory = (connectionString) => (0, appInsightsClientFactory_1.appInsightsClientFactory)(connectionString, vscode.env.machineId, vscode.env.sessionId, getXHROverride(), replacementOptions);
        // If connection string is usable by 1DS use the 1DS SDk
        if (util_1.TelemetryUtil.shouldUseOneDataSystemSDK(connectionString)) {
            clientFactory = (key) => (0, _1dsClientFactory_1.oneDataSystemClientFactory)(key, vscode, getXHROverride());
        }
        const osShim = {
            release: os.release(),
            platform: os.platform(),
            architecture: os.arch(),
        };
        const sender = new baseTelemetrySender_1.BaseTelemetrySender(connectionString, clientFactory);
        if (connectionString && connectionString.indexOf("AIF-") === 0) {
            throw new Error("AIF keys are no longer supported. Please switch to 1DS keys for 1st party extensions");
        }
        super(sender, vscode, { additionalCommonProperties: util_1.TelemetryUtil.getAdditionalCommonProperties(osShim) });
    }
}
exports.default = TelemetryReporter;
//# sourceMappingURL=telemetryReporter.js.map