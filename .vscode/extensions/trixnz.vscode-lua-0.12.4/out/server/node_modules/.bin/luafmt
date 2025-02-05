#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require('../../package.json');
const program = require("commander");
const getStdin = require("get-stdin");
const fs_1 = require("fs");
const index_1 = require("../src/index");
const options_1 = require("../src/options");
function myParseInt(inputString, defaultValue) {
    const int = parseInt(inputString, 10);
    if (isNaN(int)) {
        return defaultValue;
    }
    return int;
}
function parseWriteMode(inputString, defaultValue) {
    for (const key of Object.keys(options_1.WriteMode)) {
        if (options_1.WriteMode[key] === inputString) {
            return inputString;
        }
    }
    return defaultValue;
}
function printFormattedDocument(filename, originalDocument, formattedDocument, options) {
    switch (options.writeMode) {
        case 'stdout':
            process.stdout.write(formattedDocument);
            break;
        case 'diff':
            process.stdout.write(index_1.producePatch(filename, originalDocument, formattedDocument));
            break;
        case 'replace':
            if (filename === '<stdin>') {
                printError(filename, new Error('Write mode \'replace\' is incompatible with --stdin'));
            }
            try {
                fs_1.writeFileSync(filename, formattedDocument);
            }
            catch (err) {
                printError(filename, err);
            }
            break;
    }
}
program
    .version(pkg.version)
    .usage('[options] [file]')
    .option('--stdin', 'Read code from stdin')
    .option('-l, --line-width <width>', 'Maximum length of a line before it will be wrapped', myParseInt, options_1.defaultOptions.lineWidth)
    .option('-i, --indent-count <count>', 'Number of characters to indent', myParseInt, options_1.defaultOptions.indentCount)
    .option('--use-tabs', 'Use tabs instead of spaces for indentation')
    .option('-w, --write-mode <mode>', 'Mode for output', parseWriteMode, options_1.defaultOptions.writeMode);
program.parse(process.argv);
function printError(filename, err) {
    if (err instanceof SyntaxError) {
        console.error(`Failed to parse ${filename}:`, err);
        process.exit(2);
    }
    else {
        console.error(`Failed to format ${filename}:`, err);
        process.exit(3);
    }
}
const customOptions = {
    lineWidth: program.lineWidth,
    indentCount: program.indentCount,
    useTabs: program.useTabs,
    writeMode: program.writeMode
};
if (program.stdin) {
    getStdin().then(input => {
        printFormattedDocument('<stdin>', input, index_1.formatText(input, customOptions), customOptions);
    }).catch((err) => {
        printError('<stdin>', err);
    });
}
else {
    if (program.args.length === 0) {
        console.error('Expected <file.lua>');
        program.outputHelp();
        process.exit(1);
    }
    const filename = program.args[0];
    let input = '';
    try {
        input = fs_1.readFileSync(filename).toString();
    }
    catch (err) {
        printError(filename, err);
    }
    try {
        const formatted = index_1.formatText(input, customOptions);
        printFormattedDocument(filename, input, formatted, customOptions);
    }
    catch (err) {
        printError(filename, err);
    }
}
//# sourceMappingURL=luafmt.js.map