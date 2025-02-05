"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docBuilder_1 = require("./docBuilder");
const util_1 = require("./util");
var CommentType;
(function (CommentType) {
    CommentType[CommentType["Leading"] = 0] = "Leading";
    CommentType[CommentType["Trailing"] = 1] = "Trailing";
    CommentType[CommentType["Dangling"] = 2] = "Dangling";
    CommentType[CommentType["DanglingStatement"] = 3] = "DanglingStatement";
})(CommentType || (CommentType = {}));
function getChildrenOfNode(node) {
    const keys = Object.keys(node);
    const children = [];
    function addChild(n) {
        if (n && typeof (n.type) === 'string' && n.type !== 'Comment') {
            let idx;
            for (idx = children.length - 1; idx >= 0; --idx) {
                if (util_1.locStart(children[idx]) <= util_1.locStart(n) &&
                    util_1.locEnd(children[idx]) <= util_1.locEnd(node)) {
                    break;
                }
            }
            children.splice(idx + 1, 0, n);
        }
    }
    ;
    for (const key of keys) {
        const val = node[key];
        if (Array.isArray(val)) {
            val.forEach(addChild);
        }
        else if (val) {
            addChild(val);
        }
    }
    return children;
}
function attachComments(ast, options) {
    for (const comment of ast.comments) {
        decorateComment(ast, comment);
        const precedingNode = comment.precedingNode;
        const enclosingNode = comment.enclosingNode;
        const followingNode = comment.followingNode;
        if (util_1.hasNewLine(options.sourceText, util_1.locStart(comment), { searchBackwards: true })) {
            if (handleStatementsWithNoBodyComments(enclosingNode, comment) ||
                handleFunctionBodyComments(precedingNode, enclosingNode, comment) ||
                handleIfStatementsWithNoBodyComments(precedingNode, enclosingNode, followingNode, comment)) {
            }
            else if (followingNode) {
                addLeadingComment(followingNode, comment);
            }
            else if (precedingNode) {
                addTrailingComment(precedingNode, comment);
            }
            else if (enclosingNode) {
                addDanglingComment(enclosingNode, comment);
            }
            else {
                addDanglingComment(ast, comment);
            }
        }
        else {
            if (handleExpressionBeginComments(precedingNode, enclosingNode, comment) ||
                handleDanglingIfStatementsWithNoBodies(precedingNode, enclosingNode, comment)) {
            }
            else if (precedingNode) {
                addTrailingComment(precedingNode, comment);
            }
            else if (followingNode) {
                addLeadingComment(followingNode, comment);
            }
            else if (enclosingNode) {
                addDanglingComment(enclosingNode, comment);
            }
            else {
                addDanglingComment(ast, comment);
            }
        }
    }
}
exports.attachComments = attachComments;
function injectShebang(ast, options) {
    if (!options.sourceText.startsWith('#!')) {
        return;
    }
    const endLine = options.sourceText.indexOf('\n');
    const raw = options.sourceText.slice(0, endLine);
    const shebang = options.sourceText.slice(2, endLine);
    ast.comments.push({
        type: 'Comment',
        loc: {
            start: {
                line: 1,
                column: 0
            },
            end: {
                line: 1,
                column: endLine
            }
        },
        range: [0, endLine],
        raw,
        value: shebang
    });
}
exports.injectShebang = injectShebang;
function printDanglingComments(path, sameIndent = false) {
    const node = path.getValue();
    if (!node || !node.attachedComments) {
        return '';
    }
    const parts = [];
    path.forEach((commentPath) => {
        const comment = commentPath.getValue();
        if (comment.commentType === CommentType.Dangling) {
            parts.push(comment.raw);
        }
    }, 'attachedComments');
    if (parts.length === 0) {
        return '';
    }
    if (sameIndent) {
        return docBuilder_1.join(docBuilder_1.hardline, parts);
    }
    return docBuilder_1.indent(docBuilder_1.concat([docBuilder_1.hardline, docBuilder_1.join(docBuilder_1.hardline, parts)]));
}
exports.printDanglingComments = printDanglingComments;
function printDanglingStatementComments(path) {
    const node = path.getValue();
    if (!node || !node.attachedComments) {
        return '';
    }
    const parts = [];
    path.forEach((commentPath) => {
        const comment = commentPath.getValue();
        if (comment.commentType === CommentType.DanglingStatement) {
            parts.push(' ');
            parts.push(comment.raw);
        }
    }, 'attachedComments');
    if (parts.length === 0) {
        return '';
    }
    return docBuilder_1.concat(parts);
}
exports.printDanglingStatementComments = printDanglingStatementComments;
function printLeadingComment(path, options) {
    const comment = path.getValue();
    const isBlockComment = comment.raw.startsWith('--[[');
    if (isBlockComment) {
        return docBuilder_1.concat([
            comment.raw,
            util_1.hasNewLine(options.sourceText, util_1.locEnd(comment)) ? docBuilder_1.hardline : ' '
        ]);
    }
    const parts = [];
    parts.push(comment.raw);
    parts.push(docBuilder_1.hardline);
    if (util_1.isNextLineEmpty(options.sourceText, util_1.locEnd(comment))) {
        parts.push(docBuilder_1.hardline);
    }
    return docBuilder_1.concat(parts);
}
function printTrailingComment(path, options) {
    const comment = path.getValue();
    if (util_1.hasNewLine(options.sourceText, util_1.locStart(comment), { searchBackwards: true })) {
        const previousLineEmpty = util_1.isPreviousLineEmpty(options.sourceText, util_1.locStart(comment));
        return docBuilder_1.concat([docBuilder_1.hardline, previousLineEmpty ? docBuilder_1.hardline : '', comment.raw]);
    }
    if (comment.raw.startsWith('--[[')) {
        return docBuilder_1.concat([' ', comment.raw]);
    }
    const parts = [];
    if (util_1.isNextLineEmpty(options.sourceText, util_1.locStart(comment), { searchBackwards: true })) {
        parts.push(docBuilder_1.hardline);
    }
    parts.push(' ');
    parts.push(comment.raw);
    parts.push(docBuilder_1.breakParent);
    return docBuilder_1.lineSuffix(docBuilder_1.concat(parts));
}
function printComments(path, options, print) {
    const node = path.getValue();
    const printed = print(path);
    const comments = node.attachedComments;
    if (!comments || comments.length === 0) {
        return printed;
    }
    const leadingParts = [];
    const trailingParts = [printed];
    path.forEach((commentPath) => {
        const comment = commentPath.getValue();
        const commentType = comment.commentType;
        switch (commentType) {
            case CommentType.Leading:
                leadingParts.push(printLeadingComment(path, options));
                break;
            case CommentType.Trailing:
                trailingParts.push(printTrailingComment(path, options));
                break;
        }
    }, 'attachedComments');
    return docBuilder_1.concat(leadingParts.concat(trailingParts));
}
exports.printComments = printComments;
function decorateComment(node, comment) {
    const childNodes = getChildrenOfNode(node);
    let precedingNode = null;
    let followingNode = null;
    let left = 0;
    let right = childNodes.length;
    while (left < right) {
        const middle = Math.floor((left + right) / 2);
        const childNode = childNodes[middle];
        if (util_1.locStart(childNode) - util_1.locStart(comment) <= 0 &&
            util_1.locEnd(comment) - util_1.locEnd(childNode) <= 0) {
            comment.enclosingNode = childNode;
            decorateComment(childNode, comment);
            return;
        }
        if (util_1.locEnd(childNode) - util_1.locStart(comment) <= 0) {
            precedingNode = childNode;
            left = middle + 1;
            continue;
        }
        if (util_1.locEnd(comment) - util_1.locStart(childNode) <= 0) {
            followingNode = childNode;
            right = middle;
            continue;
        }
    }
    if (precedingNode) {
        comment.precedingNode = precedingNode;
    }
    if (followingNode) {
        comment.followingNode = followingNode;
    }
}
function addComment(node, comment) {
    const comments = node.attachedComments || (node.attachedComments = []);
    comments.push(comment);
}
function addLeadingComment(node, comment) {
    comment.commentType = CommentType.Leading;
    addComment(node, comment);
}
function addDanglingComment(node, comment) {
    comment.commentType = CommentType.Dangling;
    addComment(node, comment);
}
function addDanglingStatementComment(node, comment) {
    comment.commentType = CommentType.DanglingStatement;
    addComment(node, comment);
}
function addTrailingComment(node, comment) {
    comment.commentType = CommentType.Trailing;
    addComment(node, comment);
}
function handleStatementsWithNoBodyComments(enclosingNode, comment) {
    if (!enclosingNode || enclosingNode.body == null) {
        return false;
    }
    if (enclosingNode.body.length === 0) {
        addDanglingComment(enclosingNode, comment);
        return true;
    }
    return false;
}
function handleFunctionBodyComments(precedingNode, enclosingNode, comment) {
    if (!enclosingNode || enclosingNode.type !== 'FunctionDeclaration' || enclosingNode.body.length > 0) {
        return false;
    }
    if (enclosingNode.parameters.length > 0 &&
        enclosingNode.parameters[enclosingNode.parameters.length - 1] === precedingNode) {
        addDanglingComment(enclosingNode, comment);
        return true;
    }
    if (precedingNode && precedingNode.type === 'Identifier') {
        addDanglingComment(enclosingNode, comment);
        return true;
    }
    return false;
}
function handleIfStatementsWithNoBodyComments(precedingNode, enclosingNode, followingNode, comment) {
    if (!enclosingNode || enclosingNode.type !== 'IfStatement') {
        return false;
    }
    if (followingNode && (followingNode.type === 'ElseifClause' || followingNode.type === 'ElseClause')) {
        addDanglingComment(precedingNode, comment);
        return true;
    }
    if (precedingNode && precedingNode.type === 'ElseClause') {
        addDanglingComment(precedingNode, comment);
        return true;
    }
    return false;
}
function handleExpressionBeginComments(precedingNode, enclosingNode, comment) {
    if (comment.raw.startsWith('--[[')) {
        return false;
    }
    if (!enclosingNode) {
        return false;
    }
    switch (enclosingNode.type) {
        case 'WhileStatement':
            if (precedingNode === enclosingNode.condition) {
                addDanglingStatementComment(enclosingNode, comment);
                return true;
            }
            break;
        case 'DoStatement':
        case 'RepeatStatement':
            if (precedingNode == null) {
                addDanglingStatementComment(enclosingNode, comment);
                return true;
            }
            break;
        case 'FunctionDeclaration':
            if ((enclosingNode.parameters.length &&
                precedingNode === enclosingNode.parameters[enclosingNode.parameters.length - 1]) ||
                (precedingNode === enclosingNode.identifier)) {
                addDanglingStatementComment(enclosingNode, comment);
                return true;
            }
            break;
        case 'ForNumericStatement':
            if (precedingNode === enclosingNode.end || precedingNode === enclosingNode.step) {
                addDanglingStatementComment(enclosingNode, comment);
                return true;
            }
            break;
        case 'ForGenericStatement':
            if (precedingNode === enclosingNode.iterators[enclosingNode.iterators.length - 1]) {
                addDanglingStatementComment(enclosingNode, comment);
                return true;
            }
            break;
        case 'IfClause':
        case 'ElseifClause':
            if (precedingNode === enclosingNode.condition &&
                comment.loc.start.column > precedingNode.loc.start.column) {
                addDanglingStatementComment(enclosingNode, comment);
                return true;
            }
            break;
        case 'ElseClause':
            if (precedingNode == null) {
                addDanglingStatementComment(enclosingNode, comment);
                return true;
            }
            break;
    }
    return false;
}
function handleDanglingIfStatementsWithNoBodies(precedingNode, enclosingNode, comment) {
    if (!precedingNode || !enclosingNode) {
        return false;
    }
    if (enclosingNode.type !== 'IfStatement') {
        return false;
    }
    switch (precedingNode.type) {
        case 'IfClause':
        case 'ElseifClause':
        case 'ElseClause':
            if (precedingNode.body.length === 0) {
                addDanglingStatementComment(precedingNode, comment);
                return true;
            }
            break;
    }
    return false;
}
//# sourceMappingURL=comments.js.map