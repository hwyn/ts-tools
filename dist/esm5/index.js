import { __awaiter, __generator } from "tslib";
import { registryProjectArgv } from './config/project-argv';
import { resolveProject } from './config/resolve.project';
export var init = function (projectArgv) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                projectArgv && registryProjectArgv(projectArgv);
                return [4 /*yield*/, resolveProject.loadProjectConfig()];
            case 1:
                _a.sent();
                return [2 /*return*/, {
                        start: require('./util/start').default,
                        build: require('./util/build').default,
                        bundle: require('./util/bundle').default,
                        clean: require('./util/clean').default
                    }];
        }
    });
}); };
