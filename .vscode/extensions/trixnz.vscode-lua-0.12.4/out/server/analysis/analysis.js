"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const luaparse = require("luaparse");
const scope_1 = require("./scope");
const utils_1 = require("../utils");
class Analysis {
    constructor() {
        this.symbols = [];
        this.scopeStack = [];
        this.globalScope = null;
        this.cursorScope = null;
        this.completionTableName = null;
        luaparse.parse({
            locations: true,
            scope: true,
            wait: true,
            comments: false,
            onCreateScope: () => {
                const newScope = new scope_1.Scope();
                if (this.globalScope == null) {
                    this.globalScope = newScope;
                }
                newScope.parentScope = this.scopeStack.length ? this.scopeStack[this.scopeStack.length - 1] : null;
                this.scopeStack.push(newScope);
            },
            onCreateNode: (node) => {
                if (node.type === 'Chunk') {
                    return;
                }
                if (this.scopeStack.length === 0) {
                    throw new Error('Empty scope stack when encountering node of type ' + node.type);
                }
                const scope = this.scopeStack[this.scopeStack.length - 1];
                node.scope = scope;
                scope.nodes.push(node);
                if (node.type === 'Identifier' && node.name === '__scope_marker__') {
                    this.cursorScope = scope;
                }
                else if (node.type === 'CallExpression' && node.base.type === 'MemberExpression') {
                    const { name, container } = this.getIdentifierName(node.base);
                    if (name === '__completion_helper__') {
                        this.completionTableName = container;
                    }
                }
            },
            onDestroyScope: () => {
                this.scopeStack.pop();
            }
        });
    }
    write(text) {
        luaparse.write(text);
    }
    end(text) {
        luaparse.end(text);
    }
    buildScopedSymbols(isTableScope = false) {
        if (this.cursorScope === null) {
            return;
        }
        if (isTableScope) {
            this.addTableScopeSymbols();
            return;
        }
        this.addScopedSymbols();
    }
    buildGlobalSymbols() {
        if (this.globalScope) {
            this.globalScope.nodes.forEach((n) => this.addSymbolsForNode(n, false));
        }
    }
    addTableScopeSymbols() {
        if (!this.completionTableName) {
            return;
        }
        let currentScope = this.cursorScope;
        let abortScopeTraversal = false;
        while (currentScope !== null) {
            for (const n of currentScope.nodes) {
                if (n.type === 'LocalStatement') {
                    if (currentScope === this.cursorScope &&
                        n.variables.some(ident => ident.name === this.completionTableName)) {
                        abortScopeTraversal = true;
                    }
                }
                else if (n.type === 'AssignmentStatement') {
                    n.variables
                        .filter((v) => v.type === 'MemberExpression')
                        .forEach(v => {
                        if (v.base.type === 'Identifier' && v.base.name === this.completionTableName) {
                            this.addSymbolHelper(v.identifier, v.identifier.name, 'Variable', undefined, this.completionTableName);
                        }
                    });
                }
                if (n.type === 'LocalStatement' || n.type === 'AssignmentStatement') {
                    let variableIndex = -1;
                    for (const [i, variable] of n.variables.entries()) {
                        if (variable.type === 'Identifier' && variable.name === this.completionTableName) {
                            variableIndex = i;
                        }
                    }
                    if (variableIndex >= 0) {
                        const variableInit = n.init[variableIndex];
                        if (variableInit && variableInit.type === 'TableConstructorExpression') {
                            for (const field of variableInit.fields) {
                                switch (field.type) {
                                    case 'TableKey':
                                        if (field.key.type === 'StringLiteral') {
                                            this.addSymbolHelper(field, field.key.value, 'Variable', undefined, this.completionTableName);
                                        }
                                        break;
                                    case 'TableKeyString':
                                        if (field.key.type === 'Identifier') {
                                            this.addSymbolHelper(field, field.key.name, 'Variable', undefined, this.completionTableName);
                                        }
                                        break;
                                }
                            }
                        }
                    }
                }
            }
            if (abortScopeTraversal) {
                break;
            }
            currentScope = currentScope.parentScope;
        }
    }
    addScopedSymbols() {
        let currentScope = this.cursorScope;
        while (currentScope !== null) {
            currentScope.nodes.forEach((n) => this.addSymbolsForNode(n, true));
            currentScope = currentScope.parentScope;
        }
    }
    getIdentifierName(identifier) {
        if (identifier) {
            switch (identifier.type) {
                case 'Identifier':
                    return { name: identifier.name, container: null };
                case 'MemberExpression':
                    switch (identifier.base.type) {
                        case 'Identifier':
                            return { name: identifier.identifier.name, container: identifier.base.name };
                        default:
                            return { name: identifier.identifier.name, container: null };
                    }
            }
        }
        return { name: null, container: null };
    }
    addSymbolsForNode(node, scopedQuery) {
        switch (node.type) {
            case 'LocalStatement':
            case 'AssignmentStatement':
                this.addLocalAndAssignmentSymbols(node);
                break;
            case 'FunctionDeclaration':
                this.addFunctionSymbols(node, scopedQuery);
                break;
        }
    }
    addSymbolHelper(node, name, kind, container, display) {
        this.symbols.push({
            kind,
            name,
            container,
            display,
            range: utils_1.getNodeRange(node),
            isGlobalScope: node.scope === this.globalScope,
            isOuterScope: node.scope !== this.cursorScope
        });
    }
    addLocalAndAssignmentSymbols(node) {
        for (const variable of node.variables) {
            switch (variable.type) {
                case 'Identifier':
                    this.addSymbolHelper(variable, variable.name, 'Variable');
                    break;
            }
        }
    }
    addFunctionSymbols(node, scopedQuery) {
        const { name, container } = this.getIdentifierName(node.identifier);
        const parameters = node.parameters
            .filter((v) => v.type === 'Identifier');
        let display = 'function ';
        if (container) {
            display += container + ':';
        }
        if (name) {
            display += name;
        }
        display += '(';
        display += parameters
            .map((param) => param.name)
            .join(', ');
        display += ')';
        this.addSymbolHelper(node, name, 'Function', container || undefined, display);
        if (scopedQuery) {
            parameters
                .filter(param => param.scope.containsScope(this.cursorScope))
                .forEach((param) => {
                this.addSymbolHelper(param, param.name, 'FunctionParameter');
            });
        }
    }
}
exports.Analysis = Analysis;
//# sourceMappingURL=analysis.js.map