export declare function jsLoader(config: any): any;
export declare function cssLoader(config: any, isExtract?: boolean): {
    clone: (getConfig: (current: any) => any, _isExtract?: boolean) => any;
    css: (mergeOption?: any, preLoader?: string | any) => object & {
        [x: string]: any;
    };
    less: (mergeOption?: any, preLoader?: string | any) => object & {
        [x: string]: any;
    };
    sass: (mergeOption?: any, preLoader?: string | any) => object & {
        [x: string]: any;
    };
    more: (types: string[], options?: any, preLoader?: string) => any[];
};
export declare function assetResource(config?: any): {
    image: (mergeOptions?: any) => {
        test: RegExp;
        type: any;
        generator: any;
    };
    font: (mergeOptions?: any) => {
        test: RegExp;
        type: any;
        generator: any;
    };
};
