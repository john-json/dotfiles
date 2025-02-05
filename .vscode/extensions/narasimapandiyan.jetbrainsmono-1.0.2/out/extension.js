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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const util_1 = require("./util");
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Congratulations, your extension "${context.extension.packageJSON.displayName}" installed!`);
        (0, util_1.firstTimeActivation)(context);
        let activateCommand = vscode.commands.registerCommand("jetbrainsmono.activate", () => (0, util_1.JBMActivation)(context));
        let deactivateCommand = vscode.commands.registerCommand("jetbrainsmono.deactivate", () => (0, util_1.deactivateJBM)(context));
        context.subscriptions.push(activateCommand, deactivateCommand);
    });
}
exports.activate = activate;
function deactivate(context) {
    (0, util_1.deactivateJBM)(context);
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map