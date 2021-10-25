"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_1 = require("../config");
const fs_1 = require("../core/fs");
const clean_1 = tslib_1.__importDefault(require("./clean"));
const bundle_1 = tslib_1.__importDefault(require("./bundle"));
const run_1 = tslib_1.__importDefault(require("./run"));
const pkg = fs_1.requireSync(`${config_1.project.root}/package.json`);
exports.default = ((pkg, buildDir) => async () => {
    await run_1.default(clean_1.default);
    await run_1.default(bundle_1.default);
    await fs_1.writeFile(`${buildDir}/package.json`, JSON.stringify({
        private: true,
        scripts: {
            "start": "node server.js",
        },
        dependencies: pkg.dependencies,
    }));
})(pkg, config_1.project.outputRoot);
