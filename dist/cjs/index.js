"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var tslib_1 = require("tslib");
var project_argv_1 = require("./config/project-argv");
var resolve_project_1 = require("./config/resolve.project");
var init = function (projectArgv) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                projectArgv && (0, project_argv_1.registryProjectArgv)(projectArgv);
                return [4 /*yield*/, resolve_project_1.resolveProject.loadProjectConfig()];
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
exports.init = init;
