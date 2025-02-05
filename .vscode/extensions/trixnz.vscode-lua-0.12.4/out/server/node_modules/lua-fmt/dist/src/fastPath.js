"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
class FastPath {
    constructor(ast) {
        this.stack = [ast];
    }
    getValue() {
        return this.stack[this.stack.length - 1];
    }
    getNodeAtDepth(depth) {
        for (let i = this.stack.length - 1; i >= 0; i -= 2) {
            const value = this.stack[i];
            if (util_1.isNode(value) && --depth < 0) {
                return value;
            }
        }
        return null;
    }
    getParent(depth = 0) {
        return this.getNodeAtDepth(depth + 1);
    }
    call(callback, field) {
        const node = this.getValue();
        const origLength = this.stack.length;
        this.stack.push(field, node[field]);
        const result = callback(this);
        this.stack.length = origLength;
        return result;
    }
    forEach(callback, field = null) {
        let value = this.getValue();
        const origLength = this.stack.length;
        if (field) {
            value = value[field];
            this.stack.push(value);
        }
        for (let i = 0; i < value.length; ++i) {
            this.stack.push(i, value[i]);
            callback(this, i);
            this.stack.length -= 2;
        }
        this.stack.length = origLength;
    }
    map(callback, field) {
        const node = this.getValue()[field];
        if (!Array.isArray(node)) {
            return [];
        }
        const result = [];
        const origLength = this.stack.length;
        this.stack.push(field, node);
        node.forEach((val, i) => {
            this.stack.push(i, val);
            result.push(callback(this, i));
            this.stack.length -= 2;
        });
        this.stack.length = origLength;
        return result;
    }
    needsParens() {
        const parent = this.getParent();
        const value = this.getValue();
        let inParens = false;
        switch (value.type) {
            case 'FunctionDeclaration':
            case 'Chunk':
            case 'Identifier':
            case 'BooleanLiteral':
            case 'NilLiteral':
            case 'NumericLiteral':
            case 'StringLiteral':
            case 'VarargLiteral':
            case 'TableConstructorExpression':
            case 'BinaryExpression':
            case 'LogicalExpression':
            case 'UnaryExpression':
            case 'MemberExpression':
            case 'IndexExpression':
            case 'CallExpression':
            case 'TableCallExpression':
            case 'StringCallExpression':
                inParens = value.inParens || false;
        }
        if (parent) {
            if (value.type === 'UnaryExpression' && parent.type === 'UnaryExpression') {
                inParens = true;
            }
        }
        return inParens;
    }
}
exports.FastPath = FastPath;
//# sourceMappingURL=fastPath.js.map