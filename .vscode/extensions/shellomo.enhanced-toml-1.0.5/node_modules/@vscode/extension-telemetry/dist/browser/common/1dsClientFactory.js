/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Configures 1DS properly and returns the core client object
 * @param key The ingestion key
 * @param xhrOverride An optional override to use for requests instead of the XHTMLRequest object. Useful for node environments
 * @returns The AI core object
 */
const getAICore = async (key, vscodeAPI, xhrOverride) => {
    const oneDs = await import(/* webpackMode: "eager" */ "@microsoft/1ds-core-js");
    const postPlugin = await import(/* webpackMode: "eager" */ "@microsoft/1ds-post-js");
    const appInsightsCore = new oneDs.AppInsightsCore();
    const collectorChannelPlugin = new postPlugin.PostChannel();
    // Configure the app insights core to send to collector++ and disable logging of debug info
    const coreConfig = {
        instrumentationKey: key,
        endpointUrl: "https://mobile.events.data.microsoft.com/OneCollector/1.0",
        loggingLevelTelemetry: 0,
        loggingLevelConsole: 0,
        disableCookiesUsage: true,
        disableDbgExt: true,
        disableInstrumentationKeyValidation: true,
        channels: [[
                collectorChannelPlugin
            ]]
    };
    if (xhrOverride) {
        coreConfig.extensionConfig = {};
        // Configure the channel to use a XHR Request override since it's not available in node
        const channelConfig = {
            alwaysUseXhrOverride: true,
            httpXHROverride: xhrOverride
        };
        coreConfig.extensionConfig[collectorChannelPlugin.identifier] = channelConfig;
    }
    const config = vscodeAPI.workspace.getConfiguration("telemetry");
    const internalTesting = config.get("internalTesting");
    appInsightsCore.initialize(coreConfig, []);
    appInsightsCore.addTelemetryInitializer((envelope) => {
        envelope["ext"] = envelope["ext"] ?? {};
        envelope["ext"]["web"] = envelope["ext"]["web"] ?? {};
        envelope["ext"]["web"]["consentDetails"] = "{\"GPC_DataSharingOptIn\":false}";
        // Only add the remaining flags when `telemetry.internalTesting` is enabled
        if (!internalTesting) {
            return;
        }
        envelope["ext"]["utc"] = envelope["ext"]["utc"] ?? {};
        // Sets it to be internal only based on Windows UTC flagging
        envelope["ext"]["utc"]["flags"] = 0x0000811ECD;
    });
    return appInsightsCore;
};
/**
 * Configures and creates a telemetry client using the 1DS sdk
 * @param key The ingestion key
 * @param xhrOverride An optional override to use for requests instead of the XHTMLRequest object. Useful for node environments
 */
export const oneDataSystemClientFactory = async (key, vscodeAPI, xhrOverride) => {
    let appInsightsCore = await getAICore(key, vscodeAPI, xhrOverride);
    const flushOneDS = async () => {
        try {
            const flushPromise = new Promise((resolve, reject) => {
                if (!appInsightsCore) {
                    resolve();
                    return;
                }
                appInsightsCore.flush(true, (completedFlush) => {
                    if (!completedFlush) {
                        reject("Failed to flush app 1DS!");
                        return;
                    }
                });
            });
            return flushPromise;
        }
        catch (e) {
            throw new Error("Failed to flush 1DS!\n" + e.message);
        }
    };
    // Shape the app insights core from 1DS into a standard format
    const telemetryClient = {
        logEvent: (eventName, data) => {
            try {
                appInsightsCore?.track({
                    name: eventName,
                    baseData: { name: eventName, properties: data?.properties, measurements: data?.measurements }
                });
            }
            catch (e) {
                throw new Error("Failed to log event to app insights!\n" + e.message);
            }
        },
        flush: flushOneDS,
        dispose: async () => {
            const disposePromise = new Promise((resolve) => {
                if (!appInsightsCore) {
                    resolve();
                    return;
                }
                appInsightsCore.unload(false, () => {
                    resolve();
                    appInsightsCore = undefined;
                    return;
                }, 1000);
            });
            return disposePromise;
        }
    };
    return telemetryClient;
};
//# sourceMappingURL=1dsClientFactory.js.map