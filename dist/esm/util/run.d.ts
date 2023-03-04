type FN = (options?: object) => Promise<any>;
declare function run<T>(fn: FN | any, options?: object): Promise<T>;
export default run;
