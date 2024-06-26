import { registryProjectArgv } from './config/project-arvg';
export var init = function (projectArgv) {
    projectArgv && registryProjectArgv(projectArgv);
    return {
        start: require('./util/start').default,
        build: require('./util/build').default,
        bundle: require('./util/bundle').default,
        clean: require('./util/clean').default
    };
};
