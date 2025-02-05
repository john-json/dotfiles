"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = void 0;
function url(literals) {
    var placeholders = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        placeholders[_i - 1] = arguments[_i];
    }
    return placeholders
        .map(encodeURIComponent)
        .reduce(function (url, placeholder, index) { return url + placeholder + literals[index + 1]; }, literals[0]);
}
exports.url = url;
//# sourceMappingURL=UrlLiteral.js.map