export declare type ProjectArgv = (argv?: string[]) => string[];
export declare const registryProjectArgv: (projectArgv: ProjectArgv) => void;
export declare const getArgv: () => ProjectArgv;
