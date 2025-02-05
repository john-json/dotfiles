"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToQueryString = exports.stringToByteArray = exports.padText = void 0;
const util_1 = require("util");
/** Pad a string to have spaces on either side, making it a set `length`
 * @param str The string to add padding to
 * @param length The new total length the string should be with padding
 */
const padText = (str, length) => {
    const paddingLength = Math.max(0, length - str.length);
    const padding = " ".repeat(paddingLength / 2);
    const paddingLeft = " ".repeat(length - padding.length - str.length);
    return paddingLeft + str + padding;
};
exports.padText = padText;
/** Convert a string to a byte array */
const stringToByteArray = (str) => new util_1.TextEncoder().encode(str);
exports.stringToByteArray = stringToByteArray;
/** Convert an object into a query string without the leading `?` */
const objectToQueryString = (obj) => {
    return Object.keys(obj)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
        .join("&");
};
exports.objectToQueryString = objectToQueryString;
//# sourceMappingURL=string.service.js.map