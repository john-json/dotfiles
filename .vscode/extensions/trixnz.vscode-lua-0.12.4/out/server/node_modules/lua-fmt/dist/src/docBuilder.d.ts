export interface Concat {
    type: 'concat';
    parts: Doc[];
}
export interface Line {
    type: 'line';
    soft: boolean;
    hard: boolean;
}
export interface Indent {
    type: 'indent';
    content: Doc;
}
export interface LineSuffix {
    type: 'lineSuffix';
    content: Doc;
}
export interface Group {
    type: 'group';
    content: Doc;
    willBreak: boolean;
}
export interface BreakParent {
    type: 'breakParent';
}
export declare type Doc = string | Concat | Line | Indent | LineSuffix | Group | BreakParent;
export declare function concat(parts: Doc[]): Doc;
export declare function join(separator: Doc, parts: Doc[]): Doc;
export declare const line: Line;
export declare const hardline: Line;
export declare const softline: Line;
export declare function indent(content: Doc): Indent;
export declare function lineSuffix(content: Doc): LineSuffix;
export declare function group(content: Doc, willBreak?: boolean): Group;
export declare const breakParent: BreakParent;
export declare function isEmpty(instruction: Doc): boolean;
