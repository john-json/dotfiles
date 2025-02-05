import { IPersistentSettings, ISettings, IState } from '../../types/persistent-settings';
import { IVSCode } from '../../types/vscode';
export default class PersistentSettings implements IPersistentSettings {
    private readonly vscode;
    private readonly globalStoragePath;
    private settings;
    private readonly defaultState;
    constructor(vscode: IVSCode, globalStoragePath: string);
    getSettings(): ISettings;
    getOldPersistentSettingsPath(isInsiders: boolean, isOSS: boolean, isDev: boolean): string;
    migrateOldPersistentSettings(isInsiders: boolean, isOSS: boolean, isDev: boolean): void;
    getState(): IState;
    setState(state: IState): void;
    deleteState(): void;
    updateStatus(): IState;
    isNewVersion(): boolean;
    isFirstInstall(): boolean;
    private vscodeAppName;
    private vscodePath;
}
