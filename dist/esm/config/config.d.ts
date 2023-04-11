declare const baseDir: string;
export declare enum PlatformEnum {
    client = "client",
    server = "server",
    dll = "dll",
    serverEntry = "server-entry"
}
export declare const platformDefaultEntry: {
    client: string;
    server: string;
    dll: string;
    "server-entry": string;
};
interface buildOptions {
    index?: string;
    entry?: {
        [key: string]: any;
    };
    sourceMap?: string;
    assets?: string[][];
    styles: string[];
    themeVariable?: string;
    tsConfig?: string;
}
interface Configurations {
    proxy?: string;
    browserTarget?: [];
    publicPath?: string;
    manifestDll?: string[];
    resolveAlias: {
        [key: string]: any;
    };
    externals?: {
        [key: string]: any;
    };
    nodeExternals?: boolean;
    sourceMap?: boolean;
    isNodemon?: boolean;
    watchFile?: string[];
    hotContext?: string;
    styleLoaderOptions?: any;
}
interface Platform {
    [key: string]: {
        builder: string;
        outputPath: string;
        options: buildOptions;
        configurations?: Configurations;
        notExistence?: boolean;
    };
}
interface Build {
    platform: Platform;
    options: buildOptions;
    configurations?: Configurations;
}
interface Project {
    root: string;
    sourceRoot: string;
    outputRoot: string;
    packagePath: string;
    nodeModules: string;
    isDevelopment: boolean;
    analyzerStatus: boolean;
    architect: {
        additional: {
            options?: buildOptions;
            configurations?: Configurations;
        };
        platform: Platform;
        build?: Build;
    };
}
export declare const project: Project;
export declare const existenceClient: boolean;
export declare const existenceServer: boolean;
export declare const existenceDll: boolean;
export declare const existenceServerEntry: boolean;
export declare const babellrc: any;
export declare const platformConfig: (key?: string) => {
    root: string;
    index: string;
    externals: {
        [key: string]: any;
    };
    entry: {
        [key: string]: any;
    };
    publicPath: string;
    themeVariable: string;
    styles: string[];
    assets: string[][];
    builder: string;
    tsConfig: string;
    outputPath: string;
    browserTarget: [];
    nodeExternals: boolean;
    sourceRoot: string;
    outputRoot: string;
    nodeModules: string;
    watchFile: string[];
    hotContext: string;
    manifestDll: string[];
    resolveAlias: {
        [key: string]: any;
    };
    sourceMap: string;
    styleLoaderOptions: any;
    hasSourceMap: boolean;
    isDevelopment: boolean;
    analyzerStatus: boolean;
};
export { baseDir };
