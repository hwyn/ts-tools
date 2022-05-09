"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const config_1 = require("../config");
const compilation_1 = require("./compilation");
exports.default = async () => {
    if (!config_1.existenceServerEntry) {
        return Promise.resolve();
    }
    const config = (0, config_1.webpackDevServerEntry)();
    const multiCompiler = (0, webpack_1.default)(config, (error, stats) => {
        if (error) {
            return console.log(error);
        }
        console.log(stats.toString(config.stats));
    });
    const promise = (0, compilation_1.createCompilationPromise)('server-entry', multiCompiler, config);
    multiCompiler.watch({ aggregateTimeout: 300 }, () => { });
    return promise;
};
