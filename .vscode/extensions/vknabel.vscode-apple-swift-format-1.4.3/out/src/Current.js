"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prodEnvironment = void 0;
var vscode = require("vscode");
var UrlLiteral_1 = require("./UrlLiteral");
var AbsolutePath_1 = require("./AbsolutePath");
var fs_1 = require("fs");
var path_1 = require("path");
var os = require("os");
function prodEnvironment() {
    return {
        editor: {
            openURL: function (url) {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, vscode.commands.executeCommand("vscode.open", vscode.Uri.parse(url))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            reportIssueForError: function (error) {
                return __awaiter(this, void 0, void 0, function () {
                    var title, body;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                title = ("Report " + (error.code || "") + " " + (error.message || "")).replace(/\\n/, " ");
                                body = "`" + (error.stack || JSON.stringify(error)) + "`";
                                return [4 /*yield*/, Current.editor.openURL((0, UrlLiteral_1.url)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["https://github.com/vknabel/vscode-apple-swift-format/issues/new?title=", "&body=", ""], ["https://github.com/vknabel/vscode-apple-swift-format/issues/new?title=", "&body=", ""])), title, body))];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                });
            },
            showErrorMessage: function (message) {
                var _a;
                var actions = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    actions[_i - 1] = arguments[_i];
                }
                return (_a = vscode.window).showErrorMessage.apply(_a, __spreadArray([message], actions, false));
            },
            showWarningMessage: function (message) {
                var _a;
                var actions = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    actions[_i - 1] = arguments[_i];
                }
                return (_a = vscode.window).showWarningMessage.apply(_a, __spreadArray([message], actions, false));
            },
        },
        config: {
            isEnabled: function () {
                return vscode.workspace
                    .getConfiguration()
                    .get("apple-swift-format.enable", true);
            },
            onlyEnableOnSwiftPMProjects: function () {
                return vscode.workspace
                    .getConfiguration()
                    .get("apple-swift-format.onlyEnableOnSwiftPMProjects", false);
            },
            onlyEnableWithConfig: function () {
                return vscode.workspace
                    .getConfiguration()
                    .get("apple-swift-format.onlyEnableWithConfig", false);
            },
            swiftFormatPath: function (document) {
                // Support running from Swift PM projects
                var possibleLocalPaths = [
                    ".build/release/swift-format",
                    ".build/debug/swift-format",
                ];
                for (var _i = 0, possibleLocalPaths_1 = possibleLocalPaths; _i < possibleLocalPaths_1.length; _i++) {
                    var path = possibleLocalPaths_1[_i];
                    // Grab the project root from the local workspace
                    var workspace = vscode.workspace.getWorkspaceFolder(document.uri);
                    if (workspace == null) {
                        continue;
                    }
                    var fullPath = (0, path_1.join)(workspace.uri.fsPath, path);
                    if ((0, fs_1.existsSync)(fullPath)) {
                        return [(0, AbsolutePath_1.absolutePath)(fullPath)];
                    }
                }
                if (vscode.workspace
                    .getConfiguration()
                    .get("apple-swift-format.onlyEnableOnSwiftPMProjects", false)) {
                    return null;
                }
                // Fall back to global defaults found in settings
                return fallbackGlobalSwiftFormatPath();
            },
            resetSwiftFormatPath: function () {
                return vscode.workspace
                    .getConfiguration()
                    .update("apple-swift-format.path", undefined);
            },
            configureSwiftFormatPath: function () {
                return vscode.commands.executeCommand("workbench.action.openSettings");
            },
            formatConfigSearchPaths: function () {
                return vscode.workspace
                    .getConfiguration()
                    .get("apple-swift-format.configSearchPaths", [".swift-format"])
                    .map(AbsolutePath_1.absolutePath);
            },
        },
    };
}
exports.prodEnvironment = prodEnvironment;
var fallbackGlobalSwiftFormatPath = function () {
    var path = vscode.workspace
        .getConfiguration()
        .get("apple-swift-format.path", null);
    if (typeof path === "string") {
        return [path];
    }
    if (!Array.isArray(path) || path.length === 0) {
        path = [os.platform() === "win32" ? "swift-format.exe" : "swift-format"];
    }
    if (os.platform() !== "win32" && !path[0].includes("/")) {
        // Only a binary name, not a path. Search for it in the path (on Windows this is implicit).
        path = __spreadArray(["/usr/bin/env"], path, true);
    }
    return path;
};
var Current = prodEnvironment();
exports.default = Current;
var templateObject_1;
//# sourceMappingURL=Current.js.map