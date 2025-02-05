"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fastPath_1 = require("./fastPath");
const docBuilder_1 = require("./docBuilder");
const docUtils_1 = require("./docUtils");
const comments_1 = require("./comments");
const util_1 = require("./util");
const options_1 = require("./options");
function printStatementSequence(path, options, print) {
    const printed = [];
    path.forEach((statementPath) => {
        const parts = [print(statementPath)];
        if (util_1.isNextLineEmpty(options.sourceText, util_1.locEnd(statementPath.getValue())) && !isLastStatement(path)) {
            parts.push(docBuilder_1.hardline);
        }
        printed.push(docBuilder_1.concat(parts));
    });
    return docBuilder_1.join(docBuilder_1.hardline, printed);
}
function printIndentedStatementList(path, options, print, field) {
    const printedBody = path.call((bodyPath) => {
        return printStatementSequence(bodyPath, options, print);
    }, field);
    return docBuilder_1.indent(docBuilder_1.concat([docBuilder_1.hardline, printedBody]));
}
function printDanglingStatementComment(path) {
    const comments = path.getValue().attachedComments;
    if (!comments) {
        return '';
    }
    return docBuilder_1.concat([comments_1.printDanglingStatementComments(path), comments_1.printDanglingComments(path)]);
}
function makeStringLiteral(raw, quotemark) {
    const preferredQuoteCharacter = options_1.getStringQuotemark(quotemark);
    const alternativeQuoteCharacter = options_1.getAlternativeStringQuotemark(quotemark === 'single' ? 'single' : 'double');
    const newString = raw.replace(/\\([\s\S])|(['"])/g, (match, escaped, quote) => {
        if (escaped === alternativeQuoteCharacter) {
            return escaped;
        }
        if (quote === preferredQuoteCharacter) {
            return '\\' + quote;
        }
        return match;
    });
    return preferredQuoteCharacter + newString + preferredQuoteCharacter;
}
function printStringLiteral(path, options) {
    const literal = path.getValue();
    if (literal.type !== 'StringLiteral') {
        throw new Error('printStringLiteral: Expected StringLiteral, got ' + literal.type);
    }
    if (literal.raw.startsWith('[[') || literal.raw.startsWith('[=')) {
        return literal.raw;
    }
    const raw = literal.raw.slice(1, -1);
    let preferredQuotemark = options.quotemark;
    const preferredQuoteCharacter = options_1.getStringQuotemark(preferredQuotemark);
    if (raw.includes(preferredQuoteCharacter)) {
        preferredQuotemark = preferredQuotemark === 'single' ? 'double' : 'single';
    }
    return makeStringLiteral(raw, preferredQuotemark);
}
function isLastStatement(path) {
    const parent = path.getParent();
    const node = path.getValue();
    const body = parent.body;
    return body && body[body.length - 1] === node;
}
function printNodeNoParens(path, options, print) {
    const value = path.getValue();
    if (!value) {
        return '';
    }
    const parts = [];
    const node = value;
    switch (node.type) {
        case 'Chunk':
            parts.push(path.call((bodyPath) => {
                return printStatementSequence(bodyPath, options, print);
            }, 'body'));
            parts.push(comments_1.printDanglingComments(path, true));
            if (node.body.length || node.attachedComments) {
                parts.push(docBuilder_1.hardline);
            }
            return docBuilder_1.concat(parts);
        case 'LabelStatement':
            return docBuilder_1.concat(['::', path.call(print, 'label'), '::']);
        case 'GotoStatement':
            return docBuilder_1.concat(['goto ', path.call(print, 'label')]);
        case 'BreakStatement':
            return 'break';
        case 'ReturnStatement':
            parts.push('return');
            if (node.arguments.length > 0) {
                parts.push(' ');
                parts.push(docBuilder_1.join(', ', path.map(print, 'arguments')));
            }
            return docBuilder_1.concat(parts);
        case 'WhileStatement':
            parts.push('while ');
            parts.push(path.call(print, 'condition'));
            parts.push(' do');
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            parts.push(docBuilder_1.concat([docBuilder_1.hardline, 'end']));
            return docBuilder_1.concat(parts);
        case 'DoStatement':
            parts.push('do');
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            parts.push(docBuilder_1.concat([docBuilder_1.hardline, 'end']));
            return docBuilder_1.concat(parts);
        case 'RepeatStatement':
            parts.push('repeat');
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            parts.push(docBuilder_1.concat([docBuilder_1.hardline, 'until ']));
            parts.push(path.call(print, 'condition'));
            return docBuilder_1.concat(parts);
        case 'LocalStatement':
        case 'AssignmentStatement':
            {
                const left = [];
                if (node.type === 'LocalStatement') {
                    left.push('local ');
                }
                const shouldBreak = options.linebreakMultipleAssignments;
                left.push(docBuilder_1.indent(docBuilder_1.join(docBuilder_1.concat([
                    ',',
                    shouldBreak ? docBuilder_1.hardline : docBuilder_1.line
                ]), path.map(print, 'variables'))));
                let operator = '';
                const right = [];
                if (node.init.length) {
                    operator = ' =';
                    if (node.init.length > 1) {
                        right.push(docBuilder_1.indent(docBuilder_1.join(docBuilder_1.concat([',', docBuilder_1.line]), path.map(print, 'init'))));
                    }
                    else {
                        right.push(docBuilder_1.join(docBuilder_1.concat([',', docBuilder_1.line]), path.map(print, 'init')));
                    }
                }
                const canBreakLine = node.init.some(n => n != null &&
                    n.type !== 'TableConstructorExpression' &&
                    n.type !== 'FunctionDeclaration');
                return docBuilder_1.group(docBuilder_1.concat([
                    docBuilder_1.group(docBuilder_1.concat(left)),
                    docBuilder_1.group(docBuilder_1.concat([
                        operator,
                        canBreakLine ? docBuilder_1.indent(docBuilder_1.line) : ' ',
                        docBuilder_1.concat(right)
                    ]))
                ]));
            }
        case 'CallStatement':
            return path.call(print, 'expression');
        case 'FunctionDeclaration':
            if (node.isLocal) {
                parts.push('local ');
            }
            parts.push('function');
            if (node.identifier) {
                parts.push(' ', path.call(print, 'identifier'));
            }
            parts.push(docBuilder_1.concat([
                '(',
                docBuilder_1.group(docBuilder_1.indent(docBuilder_1.concat([
                    docBuilder_1.softline,
                    docBuilder_1.join(docBuilder_1.concat([',', docBuilder_1.line]), path.map(print, 'parameters'))
                ]))),
                ')'
            ]));
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            parts.push(docBuilder_1.hardline, 'end');
            return docBuilder_1.concat(parts);
        case 'ForNumericStatement':
            parts.push('for ');
            parts.push(path.call(print, 'variable'));
            parts.push(' = ');
            parts.push(path.call(print, 'start'));
            parts.push(', ');
            parts.push(path.call(print, 'end'));
            if (node.step) {
                parts.push(', ');
                parts.push(path.call(print, 'step'));
            }
            parts.push(' do');
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            parts.push(docBuilder_1.concat([docBuilder_1.hardline, 'end']));
            return docBuilder_1.concat(parts);
        case 'ForGenericStatement':
            parts.push('for ');
            parts.push(docBuilder_1.join(', ', path.map(print, 'variables')));
            parts.push(' in ');
            parts.push(docBuilder_1.join(', ', path.map(print, 'iterators')));
            parts.push(' do');
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            parts.push(docBuilder_1.concat([docBuilder_1.hardline, 'end']));
            return docBuilder_1.concat(parts);
        case 'IfStatement':
            const printed = [];
            path.forEach((statementPath) => {
                printed.push(print(statementPath));
            }, 'clauses');
            parts.push(docBuilder_1.join(docBuilder_1.hardline, printed));
            parts.push(docBuilder_1.concat([docBuilder_1.hardline, 'end']));
            return docBuilder_1.concat(parts);
        case 'IfClause':
            parts.push(docBuilder_1.concat([
                'if ',
                docBuilder_1.group(docBuilder_1.concat([
                    docBuilder_1.indent(docBuilder_1.concat([
                        docBuilder_1.softline,
                        path.call(print, 'condition')
                    ])),
                    docBuilder_1.softline
                ])),
                ' then'
            ]));
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            return docBuilder_1.concat(parts);
        case 'ElseifClause':
            parts.push(docBuilder_1.concat([
                'elseif ',
                docBuilder_1.group(docBuilder_1.concat([
                    docBuilder_1.indent(docBuilder_1.concat([
                        docBuilder_1.softline,
                        path.call(print, 'condition')
                    ])),
                    docBuilder_1.softline
                ])),
                ' then'
            ]));
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            return docBuilder_1.concat(parts);
        case 'ElseClause':
            parts.push('else');
            parts.push(printDanglingStatementComment(path));
            if (node.body.length) {
                parts.push(printIndentedStatementList(path, options, print, 'body'));
            }
            return docBuilder_1.concat(parts);
        case 'BooleanLiteral':
            return node.raw;
        case 'NilLiteral':
            return 'nil';
        case 'NumericLiteral':
            return node.raw;
        case 'StringLiteral':
            return printStringLiteral(path, options);
        case 'VarargLiteral':
            return '...';
        case 'Identifier':
            return node.name;
        case 'BinaryExpression':
        case 'LogicalExpression':
            const parent = path.getParent();
            const shouldGroup = parent.type !== node.type &&
                node.left.type !== node.type &&
                node.right.type !== node.type;
            const right = docBuilder_1.concat([
                node.operator,
                docBuilder_1.line,
                path.call(print, 'right')
            ]);
            return docBuilder_1.group(docBuilder_1.concat([
                path.call(print, 'left'),
                docBuilder_1.indent(docBuilder_1.concat([
                    ' ', shouldGroup ? docBuilder_1.group(right) : right
                ]))
            ]));
        case 'UnaryExpression':
            parts.push(node.operator);
            if (node.operator === 'not') {
                parts.push(' ');
            }
            parts.push(path.call(print, 'argument'));
            return docBuilder_1.concat(parts);
        case 'MemberExpression':
            return docBuilder_1.concat([
                path.call(print, 'base'),
                node.indexer,
                path.call(print, 'identifier')
            ]);
        case 'IndexExpression':
            return docBuilder_1.concat([
                path.call(print, 'base'),
                '[',
                docBuilder_1.group(docBuilder_1.concat([
                    docBuilder_1.indent(docBuilder_1.concat([docBuilder_1.softline, path.call(print, 'index')])),
                    docBuilder_1.softline
                ])),
                ']'
            ]);
        case 'CallExpression':
            const printedCallExpressionArgs = path.map(print, 'arguments');
            return docBuilder_1.concat([
                path.call(print, 'base'),
                docBuilder_1.group(docBuilder_1.concat([
                    '(',
                    docBuilder_1.indent(docBuilder_1.concat([docBuilder_1.softline, docBuilder_1.join(docBuilder_1.concat([',', docBuilder_1.line]), printedCallExpressionArgs)])),
                    docBuilder_1.softline,
                    ')'
                ]), printedCallExpressionArgs.some(docUtils_1.willBreak))
            ]);
        case 'TableCallExpression':
            parts.push(path.call(print, 'base'));
            parts.push(' ');
            parts.push(path.call(print, 'arguments'));
            return docBuilder_1.concat(parts);
        case 'StringCallExpression':
            parts.push(path.call(print, 'base'));
            parts.push(' ');
            parts.push(path.call(print, 'argument'));
            return docBuilder_1.concat(parts);
        case 'TableConstructorExpression':
            if (node.fields.length === 0) {
                return '{}';
            }
            const fields = [];
            let separatorParts = [];
            path.forEach(childPath => {
                fields.push(docBuilder_1.concat(separatorParts));
                fields.push(docBuilder_1.group(print(childPath)));
                separatorParts = [',', docBuilder_1.line];
            }, 'fields');
            const shouldBreak = util_1.hasNewLineInRange(options.sourceText, node.range[0], node.range[1]);
            return docBuilder_1.group(docBuilder_1.concat([
                '{',
                docBuilder_1.indent(docBuilder_1.concat([docBuilder_1.softline, docBuilder_1.concat(fields)])),
                docBuilder_1.softline,
                '}'
            ]), shouldBreak);
        case 'TableKeyString':
            return docBuilder_1.concat([
                path.call(print, 'key'),
                ' = ',
                path.call(print, 'value')
            ]);
        case 'TableKey':
            return docBuilder_1.concat([
                '[', path.call(print, 'key'), ']',
                ' = ',
                path.call(print, 'value')
            ]);
        case 'TableValue':
            return path.call(print, 'value');
    }
    throw new Error('Unhandled AST node: ' + node.type);
}
function printNode(path, options, print) {
    const printed = printNodeNoParens(path, options, print);
    const parts = [];
    const needsParens = path.needsParens();
    if (needsParens) {
        parts.push('(');
    }
    parts.push(printed);
    if (needsParens) {
        parts.push(')');
    }
    return docBuilder_1.concat(parts);
}
function buildDocFromAst(ast, options) {
    const printNodeWithComments = (path) => {
        return comments_1.printComments(path, options, p => printNode(p, options, printNodeWithComments));
    };
    const doc = printNodeWithComments(new fastPath_1.FastPath(ast));
    docUtils_1.propagateBreaks(doc);
    return doc;
}
exports.buildDocFromAst = buildDocFromAst;
//# sourceMappingURL=printer.js.map