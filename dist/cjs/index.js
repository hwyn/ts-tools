"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
var project_arvg_1 = require("./config/project-arvg");
var init = function (projectArgv) {
    projectArgv && (0, project_arvg_1.registryProjectArgv)(projectArgv);
    return {
        start: require('./util/start').default,
        build: require('./util/build').default,
        bundle: require('./util/bundle').default,
        clean: require('./util/clean').default
    };
};
exports.init = init;
