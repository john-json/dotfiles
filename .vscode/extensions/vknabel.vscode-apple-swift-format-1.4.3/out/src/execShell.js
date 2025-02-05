"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execShellSync = void 0;
var child_process_1 = require("child_process");
var os = require("os");
function execShellSync(file, args, options) {
    if (os.platform() === "win32") {
        var result = (0, child_process_1.spawnSync)(file, args !== null && args !== void 0 ? args : [], __assign(__assign({}, options), { encoding: "utf8", shell: true }));
        if (result.error) {
            throw result.error;
        }
        return result.stdout;
    }
    else {
        return (0, child_process_1.execFileSync)(file, args, options);
    }
}
exports.execShellSync = execShellSync;
//# sourceMappingURL=execShell.js.map