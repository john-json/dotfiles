import { IDefaults } from '../../types/defaults';
import { IPackageJSON } from '../../types/packagejson';
import { IThemeIconsJSON } from '../../types/icons';
export declare const getDefaultsJson: () => IDefaults;
export declare const getPackageJson: () => IPackageJSON;
export declare const getIconsVariantJson: (path: string) => IThemeIconsJSON;
export declare const getAbsolutePath: (input: string) => string;
