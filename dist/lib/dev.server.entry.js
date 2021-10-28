"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = (0, tslib_1.__importDefault)(require("webpack"));
const bundle_1 = require("../util/bundle");
const config_1 = require("../config");
const compilation_1 = require("./compilation");
exports.default = async () => {
    const config = (0, config_1.webpackDevServerEntry)();
    if (!(0, bundle_1.isRun)(config)) {
        return Promise.resolve();
    }
    const multiCompiler = (0, webpack_1.default)(config);
    const promise = (0, compilation_1.createCompilationPromise)('server-entry', multiCompiler, config);
    multiCompiler.watch({
        aggregateTimeout: 300,
    }, () => { });
    return promise;
};
