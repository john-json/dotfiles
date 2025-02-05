"use strict";
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTelemetrySender = void 0;
var InstantiationStatus;
(function (InstantiationStatus) {
    InstantiationStatus[InstantiationStatus["NOT_INSTANTIATED"] = 0] = "NOT_INSTANTIATED";
    InstantiationStatus[InstantiationStatus["INSTANTIATING"] = 1] = "INSTANTIATING";
    InstantiationStatus[InstantiationStatus["INSTANTIATED"] = 2] = "INSTANTIATED";
})(InstantiationStatus || (InstantiationStatus = {}));
class BaseTelemetrySender {
    constructor(key, clientFactory) {
        // Whether or not the client has been instantiated
        this._instantiationStatus = InstantiationStatus.NOT_INSTANTIATED;
        // Queues used to store events until the sender is ready
        this._eventQueue = [];
        this._exceptionQueue = [];
        this._clientFactory = clientFactory;
        this._key = key;
    }
    /**
     * Sends the event to the passed in telemetry client
     * The sender does no telemetry level checks as those are done by the reporter.
     * @param eventName The name of the event to log
     * @param data The data contanied in the event
     */
    sendEventData(eventName, data) {
        if (!this._telemetryClient) {
            if (this._instantiationStatus !== InstantiationStatus.INSTANTIATED) {
                this._eventQueue.push({ eventName, data });
            }
            return;
        }
        this._telemetryClient.logEvent(eventName, data);
    }
    /**
     * Sends an exception to the passed in telemetry client
     * The sender does no telemetry level checks as those are done by the reporter.
     * @param exception The exception to collect
     * @param data Data associated with the exception
     */
    sendErrorData(exception, data) {
        if (!this._telemetryClient) {
            if (this._instantiationStatus !== InstantiationStatus.INSTANTIATED) {
                this._exceptionQueue.push({ exception, data });
            }
            return;
        }
        const errorData = { stack: exception.stack, message: exception.message, name: exception.name };
        if (data) {
            const errorProperties = data.properties || data;
            data.properties = { ...errorProperties, ...errorData };
        }
        else {
            data = { properties: errorData };
        }
        this._telemetryClient.logEvent("unhandlederror", data);
    }
    /**
     * Flushes the buffered telemetry data
     */
    async flush() {
        return this._telemetryClient?.flush();
    }
    async dispose() {
        if (this._telemetryClient) {
            await this._telemetryClient.dispose();
            this._telemetryClient = undefined;
        }
        return;
    }
    /**
     * Flushes the queued events that existed before the client was instantiated
     */
    _flushQueues() {
        this._eventQueue.forEach(({ eventName, data }) => this.sendEventData(eventName, data));
        this._eventQueue = [];
        this._exceptionQueue.forEach(({ exception, data }) => this.sendErrorData(exception, data));
        this._exceptionQueue = [];
    }
    /**
     * Instantiates the telemetry client to make the sender "active"
     */
    instantiateSender() {
        if (this._instantiationStatus !== InstantiationStatus.NOT_INSTANTIATED) {
            return;
        }
        this._instantiationStatus = InstantiationStatus.INSTANTIATING;
        // Call the client factory to get the client and then let it know it's instatntiated
        this._clientFactory(this._key).then(client => {
            this._telemetryClient = client;
            this._instantiationStatus = InstantiationStatus.INSTANTIATED;
            this._flushQueues();
        }).catch(err => {
            console.error(err);
            // If it failed to instntiate, then we don't want to try again.
            // So we mark it as instantiated. See #94
            this._instantiationStatus = InstantiationStatus.INSTANTIATED;
        });
    }
}
exports.BaseTelemetrySender = BaseTelemetrySender;
//# sourceMappingURL=baseTelemetrySender.js.map