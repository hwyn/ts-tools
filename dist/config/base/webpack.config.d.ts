import { Configuration, WebpackPluginInstance as Plugin } from 'webpack';
export declare const getMergeConfig: (filePath: string, jsRules?: any, cssRules?: any, config?: any) => Configuration;
export declare const filterAttr: (mergeConfig: any, filter: string[]) => any;
export declare const copyPlugin: (formFile: Array<string[]>, toFile: string, sourcePath?: string) => Plugin[];
declare const _default: Configuration;
export default _default;
