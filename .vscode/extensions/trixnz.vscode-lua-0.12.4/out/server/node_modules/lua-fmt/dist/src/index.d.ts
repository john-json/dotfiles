import { UserOptions } from './options';
export { UserOptions, defaultOptions, WriteMode } from './options';
export declare function formatText(text: string, userOptions?: UserOptions): string;
export declare function producePatch(filename: string, originalDocument: string, formattedDocument: string): string;
