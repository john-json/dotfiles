import { IMaterialThemeSettings } from '../../types/material-theme';
export declare const getCurrentThemeID: () => string;
export declare const getCurrentIconsID: () => string;
export declare const setIconsID: (id: string) => Thenable<void>;
export declare const getMaterialThemeSettings: () => IMaterialThemeSettings;
export declare const openMaterialThemeExt: () => Thenable<void>;
export declare const reloadWindow: () => Thenable<Record<string, unknown> | undefined>;
