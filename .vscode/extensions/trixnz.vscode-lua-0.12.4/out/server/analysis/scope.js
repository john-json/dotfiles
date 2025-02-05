"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scope {
    constructor() {
        this.nodes = [];
        this.parentScope = null;
    }
    containsScope(otherScope) {
        let currentScope = otherScope;
        while (currentScope !== null) {
            if (currentScope === this) {
                return true;
            }
            currentScope = currentScope.parentScope;
        }
        return false;
    }
}
exports.Scope = Scope;
//# sourceMappingURL=scope.js.map