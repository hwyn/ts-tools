import { __awaiter } from "tslib";
import { registryProjectArgv } from './config/project-argv';
import { resolveProject } from './config/resolve.project';
export const init = (projectArgv) => __awaiter(void 0, void 0, void 0, function* () {
    projectArgv && registryProjectArgv(projectArgv);
    yield resolveProject.loadProjectConfig();
    return {
        start: require('./util/start').default,
        build: require('./util/build').default,
        bundle: require('./util/bundle').default,
        clean: require('./util/clean').default
    };
});
