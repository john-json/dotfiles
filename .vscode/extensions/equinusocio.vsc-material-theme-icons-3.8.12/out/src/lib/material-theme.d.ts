/**
 * Main utilities for Material Theme integration
 */
import { IDefaults } from '../../types/defaults';
export declare const materialThemes: string[];
export declare const isMaterialTheme: (currentThemeId: string) => boolean;
export declare const getThemeIconVariant: (defaults: IDefaults, currentThemeId: string) => string | undefined;
