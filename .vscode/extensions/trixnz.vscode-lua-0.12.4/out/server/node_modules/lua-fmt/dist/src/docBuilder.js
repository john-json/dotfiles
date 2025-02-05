"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function concat(parts) {
    return {
        type: 'concat',
        parts
    };
}
exports.concat = concat;
function join(separator, parts) {
    const result = [];
    parts.forEach((val, i) => {
        if (i > 0) {
            result.push(separator);
        }
        result.push(val);
    });
    return concat(result);
}
exports.join = join;
exports.line = {
    type: 'line',
    hard: false,
    soft: false
};
exports.hardline = {
    type: 'line',
    hard: true,
    soft: false
};
exports.softline = {
    type: 'line',
    hard: false,
    soft: true
};
function indent(content) {
    return {
        type: 'indent',
        content
    };
}
exports.indent = indent;
function lineSuffix(content) {
    return {
        type: 'lineSuffix',
        content
    };
}
exports.lineSuffix = lineSuffix;
function group(content, willBreak = false) {
    return {
        type: 'group',
        content,
        willBreak
    };
}
exports.group = group;
exports.breakParent = {
    type: 'breakParent'
};
function isEmpty(instruction) {
    return typeof (instruction) === 'string' && instruction.length === 0;
}
exports.isEmpty = isEmpty;
//# sourceMappingURL=docBuilder.js.map