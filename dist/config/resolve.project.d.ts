export declare const resolve: (base: string) => (..._path: string[]) => string;
export declare const baseDir: string;
export declare const baseResolve: (..._path: string[]) => string;
declare class ResolveConfig {
    private _projectConfig;
    private projectPath;
    baseResolve: (..._path: string[]) => string;
    getArgvConfig: (attr: string) => string | null;
    constructor();
    loadProjectConfig(): Promise<this>;
    get projectConfig(): any;
}
export declare const resolveProject: ResolveConfig;
export {};
