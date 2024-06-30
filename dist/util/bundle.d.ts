import { Configuration } from 'webpack';
export declare const isRun: (webpackconfig: Configuration) => boolean;
export declare function webpackRun(webpackconfig: Configuration | Configuration[], _stast?: any): Promise<any>;
export declare function webpackRunDll(): Promise<any>;
declare const _default: () => Promise<any>;
export default _default;
