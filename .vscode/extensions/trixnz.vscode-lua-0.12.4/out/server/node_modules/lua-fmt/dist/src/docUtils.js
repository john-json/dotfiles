"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function visitInstructions(insn, onEnter, onExit) {
    let abort = false;
    const visitInstruction = (ins) => {
        if (onEnter(ins)) {
            abort = true;
            return;
        }
        if (abort) {
            return;
        }
        if (typeof ins === 'string') {
            return;
        }
        switch (ins.type) {
            case 'concat':
                ins.parts.forEach(visitInstruction);
                break;
            case 'indent':
            case 'group':
            case 'lineSuffix':
                visitInstruction(ins.content);
                break;
        }
        if (onExit) {
            onExit(ins);
        }
    };
    visitInstruction(insn);
}
function any(insn, callback) {
    let result = false;
    visitInstructions(insn, (instruction) => {
        if (callback(instruction)) {
            result = true;
            return true;
        }
        return false;
    });
    return result;
}
function willBreak(insn) {
    return any(insn, (instruction) => {
        if (typeof instruction === 'string') {
            return false;
        }
        switch (instruction.type) {
            case 'line':
                if (instruction.hard) {
                    return true;
                }
                break;
            case 'group':
                if (instruction.willBreak) {
                    return true;
                }
        }
        return false;
    });
}
exports.willBreak = willBreak;
function breakParentGroup(stack) {
    if (stack.length > 0) {
        stack[stack.length - 1].willBreak = true;
    }
}
function propagateBreaks(insn) {
    const groupStack = [];
    visitInstructions(insn, (instruction) => {
        if (typeof instruction === 'string') {
            return false;
        }
        switch (instruction.type) {
            case 'breakParent':
                breakParentGroup(groupStack);
                break;
            case 'group':
                groupStack.push(instruction);
                break;
        }
        return false;
    }, (instruction) => {
        if (typeof instruction === 'string') {
            return false;
        }
        if (instruction.type === 'group') {
            const group = groupStack.pop();
            if (group && group.willBreak) {
                breakParentGroup(groupStack);
            }
        }
        return false;
    });
}
exports.propagateBreaks = propagateBreaks;
//# sourceMappingURL=docUtils.js.map