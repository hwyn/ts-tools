type FN = (options?: object) => Promise<any>;
declare function run<T>(fn: FN | any, options?: object): Promise<T>;
export declare function init(): Promise<void>;
export default run;
