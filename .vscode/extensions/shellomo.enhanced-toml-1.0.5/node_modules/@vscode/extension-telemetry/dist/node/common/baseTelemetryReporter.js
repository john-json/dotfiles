"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTelemetryReporter = void 0;
class BaseTelemetryReporter {
    constructor(telemetrySender, vscodeAPI, initializationOptions) {
        this.telemetrySender = telemetrySender;
        this.vscodeAPI = vscodeAPI;
        this.userOptIn = false;
        this.errorOptIn = false;
        this.disposables = [];
        this._onDidChangeTelemetryLevel = new this.vscodeAPI.EventEmitter();
        this.onDidChangeTelemetryLevel = this._onDidChangeTelemetryLevel.event;
        this.telemetryLogger = this.vscodeAPI.env.createTelemetryLogger(this.telemetrySender, initializationOptions);
        // Keep track of the user's opt-in status
        this.updateUserOptIn();
        this.telemetryLogger.onDidChangeEnableStates(() => {
            this.updateUserOptIn();
        });
    }
    /**
     * Updates the user's telemetry opt-in status
     */
    updateUserOptIn() {
        this.errorOptIn = this.telemetryLogger.isErrorsEnabled;
        this.userOptIn = this.telemetryLogger.isUsageEnabled;
        // The sender is lazy loaded so if telemetry is off it's not loaded in
        if (this.telemetryLogger.isErrorsEnabled || this.telemetryLogger.isUsageEnabled) {
            this.telemetrySender.instantiateSender();
        }
        this._onDidChangeTelemetryLevel.fire(this.telemetryLevel);
    }
    get telemetryLevel() {
        if (this.errorOptIn && this.userOptIn) {
            return "all";
        }
        else if (this.errorOptIn) {
            return "error";
        }
        else {
            return "off";
        }
    }
    /**
     * Internal function which logs telemetry events and takes extra options.
     * @param eventName The name of the event
     * @param properties The properties of the event
     * @param measurements The measurements (numeric values) to send with the event
     * @param sanitize Whether or not to sanitize to the properties and measures
     * @param dangerous Whether or not to ignore telemetry level
     */
    internalSendTelemetryEvent(eventName, properties, measurements, dangerous) {
        // If it's dangerous we skip going through the logger as the logger checks opt-in status, etc.
        if (dangerous) {
            this.telemetrySender.sendEventData(eventName, { properties, measurements });
        }
        else {
            this.telemetryLogger.logUsage(eventName, { properties, measurements });
        }
    }
    /**
     * Given an event name, some properties, and measurements sends a telemetry event.
     * Properties are sanitized on best-effort basis to remove sensitive data prior to sending.
     * @param eventName The name of the event
     * @param properties The properties to send with the event
     * @param measurements The measurements (numeric values) to send with the event
     */
    sendTelemetryEvent(eventName, properties, measurements) {
        this.internalSendTelemetryEvent(eventName, properties, measurements, false);
    }
    /**
     * Sends a raw (unsanitized) telemetry event with the given properties and measurements.
     * NOTE: This will not be logged to the output channel due to API limitations.
     * @param eventName The name of the event
     * @param properties The set of properties to add to the event in the form of a string key value pair
     * @param measurements The set of measurements to add to the event in the form of a string key  number value pair
     */
    sendRawTelemetryEvent(eventName, properties, measurements) {
        const modifiedProperties = { ...properties };
        for (const propertyKey of Object.keys(modifiedProperties ?? {})) {
            const propertyValue = modifiedProperties[propertyKey];
            if (typeof propertyKey === "string" && propertyValue !== undefined) {
                // Trusted values are not sanitized, which is what we want for raw telemetry
                modifiedProperties[propertyKey] = new this.vscodeAPI.TelemetryTrustedValue(typeof propertyValue === "string" ? propertyValue : propertyValue.value);
            }
        }
        this.sendTelemetryEvent(eventName, modifiedProperties, measurements);
    }
    /**
     * **DANGEROUS** Given an event name, some properties, and measurements sends a telemetry event without checking telemetry setting
     * Do not use unless in a controlled environment i.e. sending telmetry from a CI pipeline or testing during development
     * @param eventName The name of the event
     * @param properties The properties to send with the event
     * @param measurements The measurements (numeric values) to send with the event
     * @param sanitize Whether or not to sanitize to the properties and measures, defaults to true
     */
    sendDangerousTelemetryEvent(eventName, properties, measurements) {
        // Since telemetry is probably off when sending dangerously, we must start the sender
        this.telemetrySender.instantiateSender();
        this.internalSendTelemetryEvent(eventName, properties, measurements, true);
    }
    /**
     * Internal function which logs telemetry error events and takes extra options.
     * @param eventName The name of the event
     * @param properties The properties of the event
     * @param measurements The measurements (numeric values) to send with the event
     * @param sanitize Whether or not to sanitize to the properties and measures
     * @param dangerous Whether or not to ignore telemetry level
     */
    internalSendTelemetryErrorEvent(eventName, properties, measurements, dangerous) {
        if (dangerous) {
            this.telemetrySender.sendEventData(eventName, { properties, measurements });
        }
        else {
            this.telemetryLogger.logError(eventName, { properties, measurements });
        }
    }
    /**
     * Given an event name, some properties, and measurements sends an error event
     * @param eventName The name of the event
     * @param properties The properties to send with the event
     * @param measurements The measurements (numeric values) to send with the event
     */
    sendTelemetryErrorEvent(eventName, properties, measurements) {
        this.internalSendTelemetryErrorEvent(eventName, properties, measurements, false);
    }
    /**
     * **DANGEROUS** Given an event name, some properties, and measurements sends a telemetry error event without checking telemetry setting
     * Do not use unless in a controlled environment i.e. sending telmetry from a CI pipeline or testing during development
     * @param eventName The name of the event
     * @param properties The properties to send with the event
     * @param measurements The measurements (numeric values) to send with the event
     * @param sanitize Whether or not to run the properties and measures through sanitiziation, defaults to true
     */
    sendDangerousTelemetryErrorEvent(eventName, properties, measurements) {
        // Since telemetry is probably off when sending dangerously, we must start the sender
        this.telemetrySender.instantiateSender();
        this.internalSendTelemetryErrorEvent(eventName, properties, measurements, true);
    }
    /**
     * Disposes of the telemetry reporter
     */
    async dispose() {
        await this.telemetrySender.dispose();
        this.telemetryLogger.dispose();
        return Promise.all(this.disposables.map(d => d.dispose()));
    }
}
exports.BaseTelemetryReporter = BaseTelemetryReporter;
//# sourceMappingURL=baseTelemetryReporter.js.map