"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFormatError = void 0;
var path = require("path");
var Current_1 = require("./Current");
var FormatErrorInteraction;
(function (FormatErrorInteraction) {
    FormatErrorInteraction["configure"] = "Configure";
    FormatErrorInteraction["reset"] = "Reset";
    FormatErrorInteraction["howTo"] = "How?";
})(FormatErrorInteraction || (FormatErrorInteraction = {}));
var UnknownErrorInteraction;
(function (UnknownErrorInteraction) {
    UnknownErrorInteraction["reportIssue"] = "Report issue";
})(UnknownErrorInteraction || (UnknownErrorInteraction = {}));
var stdinIncompatibleSwiftSyntaxErrorRegex = /<stdin>((:\d+:\d+: error)?: SwiftSyntax parser library isn't compatible)/;
var stdinErrorRegex = /((:\d+:\d+: error)?: [^.]+.)/;
function handleFormatError(error, document) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        function matches() {
            var codeOrStatus = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                codeOrStatus[_i] = arguments[_i];
            }
            return codeOrStatus.some(function (c) {
                if (typeof error.stderr === "string" && error.stderr.includes(c)) {
                    return true;
                }
                return c === error.code || c === error.status;
            });
        }
        var selection, _b, selection, execArray, unknownErrorSelection;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (matches("Domain=NSCocoaErrorDomain Code=260")) {
                        return [2 /*return*/];
                    }
                    if (!matches("Found a configuration for")) return [3 /*break*/, 2];
                    return [4 /*yield*/, Current_1.default.editor.showWarningMessage(error.stderr)];
                case 1:
                    _c.sent();
                    return [2 /*return*/];
                case 2:
                    if (!matches("ENOENT", "EACCES", 127)) return [3 /*break*/, 9];
                    return [4 /*yield*/, Current_1.default.editor.showErrorMessage("Could not find apple/swift-format: " + ((_a = Current_1.default.config
                            .swiftFormatPath(document)) === null || _a === void 0 ? void 0 : _a.join(" ")), FormatErrorInteraction.reset, FormatErrorInteraction.configure, FormatErrorInteraction.howTo)];
                case 3:
                    selection = _c.sent();
                    _b = selection;
                    switch (_b) {
                        case FormatErrorInteraction.reset: return [3 /*break*/, 4];
                        case FormatErrorInteraction.configure: return [3 /*break*/, 5];
                        case FormatErrorInteraction.howTo: return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 8];
                case 4:
                    Current_1.default.config.resetSwiftFormatPath();
                    return [3 /*break*/, 8];
                case 5:
                    Current_1.default.config.configureSwiftFormatPath();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, Current_1.default.editor.openURL("https://github.com/vknabel/vscode-apple-swift-format#global-installation")];
                case 7:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 21];
                case 9:
                    if (!(error.code === "EPIPE")) return [3 /*break*/, 11];
                    return [4 /*yield*/, Current_1.default.editor.showErrorMessage("apple/swift-format was closed. " + (error.stderr || ""))];
                case 10:
                    _c.sent();
                    return [3 /*break*/, 21];
                case 11:
                    if (!(error.status === 70)) return [3 /*break*/, 13];
                    return [4 /*yield*/, Current_1.default.editor.showErrorMessage("apple/swift-format failed. " + (error.stderr || ""))];
                case 12:
                    _c.sent();
                    return [3 /*break*/, 21];
                case 13:
                    if (!(error.status === 1 &&
                        (stdinIncompatibleSwiftSyntaxErrorRegex.test(error.message) ||
                            ("stderr" in error &&
                                typeof error.stderr === "string" &&
                                error.stderr.includes("_InternalSwiftSyntaxParser"))))) return [3 /*break*/, 17];
                    return [4 /*yield*/, Current_1.default.editor.showWarningMessage("apple/swift-format does not fit your Swift version. Do you need to update and recompile it?", "How?")];
                case 14:
                    selection = _c.sent();
                    if (!(selection == "How?")) return [3 /*break*/, 16];
                    return [4 /*yield*/, Current_1.default.editor.openURL("https://github.com/vknabel/vscode-apple-swift-format#appleswift-format-for-vs-code")];
                case 15:
                    _c.sent();
                    _c.label = 16;
                case 16: return [3 /*break*/, 21];
                case 17:
                    if (!(error.status === 1 && stdinErrorRegex.test(error.stderr))) return [3 /*break*/, 18];
                    execArray = stdinErrorRegex.exec(error.stderr);
                    Current_1.default.editor.showWarningMessage("" + path.basename(document.fileName) + execArray[1]);
                    return [3 /*break*/, 21];
                case 18: return [4 /*yield*/, Current_1.default.editor.showErrorMessage("An unknown error occurred. " + (error.message || ""), UnknownErrorInteraction.reportIssue)];
                case 19:
                    unknownErrorSelection = _c.sent();
                    if (!(unknownErrorSelection === UnknownErrorInteraction.reportIssue)) return [3 /*break*/, 21];
                    return [4 /*yield*/, Current_1.default.editor.reportIssueForError(error)];
                case 20:
                    _c.sent();
                    _c.label = 21;
                case 21: return [2 /*return*/];
            }
        });
    });
}
exports.handleFormatError = handleFormatError;
//# sourceMappingURL=UserInteraction.js.map