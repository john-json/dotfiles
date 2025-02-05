"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WriteMode;
(function (WriteMode) {
    WriteMode["StdOut"] = "stdout";
    WriteMode["Replace"] = "replace";
    WriteMode["Diff"] = "diff";
})(WriteMode = exports.WriteMode || (exports.WriteMode = {}));
exports.defaultOptions = {
    sourceText: '',
    lineWidth: 120,
    indentCount: 4,
    useTabs: false,
    linebreakMultipleAssignments: false,
    quotemark: 'double',
    writeMode: WriteMode.StdOut
};
function getStringQuotemark(quotemark) {
    return quotemark === 'single' ? '\'' : '"';
}
exports.getStringQuotemark = getStringQuotemark;
function getAlternativeStringQuotemark(quotemark) {
    return quotemark === 'single' ? '"' : '\'';
}
exports.getAlternativeStringQuotemark = getAlternativeStringQuotemark;
//# sourceMappingURL=options.js.map