"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV === 'development') {
    require('source-map-support').install();
}
const comments_1 = require("./comments");
const printer_1 = require("./printer");
const docPrinter_1 = require("./docPrinter");
const options_1 = require("./options");
const luaparse_1 = require("luaparse");
const diff_1 = require("diff");
var options_2 = require("./options");
exports.defaultOptions = options_2.defaultOptions;
exports.WriteMode = options_2.WriteMode;
function formatText(text, userOptions) {
    const ast = luaparse_1.parse(text, {
        comments: true,
        locations: true,
        ranges: true,
        luaVersion: '5.3'
    });
    ast.range[0] = 0;
    ast.range[1] = text.length;
    const mergedOptions = Object.assign({}, options_1.defaultOptions, userOptions);
    const options = Object.assign({}, mergedOptions, { sourceText: text });
    comments_1.injectShebang(ast, options);
    comments_1.attachComments(ast, options);
    const doc = printer_1.buildDocFromAst(ast, options);
    const formattedText = docPrinter_1.printDocToString(doc, options);
    return formattedText;
}
exports.formatText = formatText;
function producePatch(filename, originalDocument, formattedDocument) {
    return diff_1.createPatch(filename, originalDocument, formattedDocument, 'original', 'formatted');
}
exports.producePatch = producePatch;
//# sourceMappingURL=index.js.map