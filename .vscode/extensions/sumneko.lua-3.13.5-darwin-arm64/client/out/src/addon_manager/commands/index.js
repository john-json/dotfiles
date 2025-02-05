"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = void 0;
const enable_1 = __importDefault(require("./enable"));
const disable_1 = __importDefault(require("./disable"));
const open_1 = __importDefault(require("./open"));
const getAddons_1 = __importDefault(require("./getAddons"));
const refreshAddons_1 = __importDefault(require("./refreshAddons"));
const openLog_1 = __importDefault(require("./openLog"));
const update_1 = __importDefault(require("./update"));
const uninstall_1 = __importDefault(require("./uninstall"));
const setVersion_1 = __importDefault(require("./setVersion"));
exports.commands = {
    enable: enable_1.default,
    disable: disable_1.default,
    open: open_1.default,
    getAddons: getAddons_1.default,
    refreshAddons: refreshAddons_1.default,
    openLog: openLog_1.default,
    update: update_1.default,
    uninstall: uninstall_1.default,
    setVersion: setVersion_1.default,
};
//# sourceMappingURL=index.js.map