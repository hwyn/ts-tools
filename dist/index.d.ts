import { ProjectArgv } from './config/project-argv';
export declare const init: (projectArgv?: ProjectArgv) => Promise<{
    start: any;
    build: any;
    bundle: any;
    clean: any;
}>;
