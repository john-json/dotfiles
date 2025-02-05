"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.absolutePath = void 0;
var os = require("os");
var path = require("path");
function absolutePath(userDefinedPath) {
    return userDefinedPath.includes("~")
        ? path.normalize(userDefinedPath.replace(/^~/, os.homedir() + "/"))
        : userDefinedPath;
}
exports.absolutePath = absolutePath;
//# sourceMappingURL=AbsolutePath.js.map