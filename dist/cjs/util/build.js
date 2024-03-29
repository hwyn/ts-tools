"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = require("../config");
const fs_1 = require("../core/fs");
const clean_1 = tslib_1.__importDefault(require("./clean"));
const bundle_1 = tslib_1.__importDefault(require("./bundle"));
const run_1 = tslib_1.__importDefault(require("./run"));
const fs_2 = tslib_1.__importDefault(require("fs"));
const defaultPath = `${config_1.project.packagePath}/package.json`;
const pkg = (0, fs_1.requireSync)(fs_2.default.existsSync(defaultPath) ? defaultPath : config_1.project.packagePath);
exports.default = ((pkg, buildDir) => async () => {
    await (0, run_1.default)(clean_1.default);
    await (0, run_1.default)(bundle_1.default);
    await (0, fs_1.writeFile)(`${buildDir}/package.json`, JSON.stringify({
        private: true,
        scripts: {
            "start": "node server.js",
        },
        dependencies: pkg.dependencies,
    }));
})(pkg || {}, config_1.project.outputRoot);
