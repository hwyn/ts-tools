/// <reference types="node" />
export declare const exists: (path: string) => Promise<boolean>;
export declare const cleanDir: (path: string, options?: any) => Promise<undefined>;
export declare const mkdir: (path: string, options?: any) => Promise<any>;
export declare const writeFile: (path: string, data: Buffer | string, options?: any) => Promise<string>;
export declare const requireSync: (path: string) => any;
