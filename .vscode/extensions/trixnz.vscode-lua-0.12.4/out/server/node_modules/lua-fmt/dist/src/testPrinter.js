"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luafmt = require("./index");
const fs = require("fs");
const file = fs.readFileSync('test/lua-5.3.4-tests/calls.lua');
const formatted = luafmt.formatText(file.toString(), {
    lineWidth: 60,
    quotemark: 'single'
});
console.log(formatted);
//# sourceMappingURL=testPrinter.js.map