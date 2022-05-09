"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const webpack_1 = tslib_1.__importDefault(require("webpack"));
const express_1 = tslib_1.__importDefault(require("express"));
const webpack_dev_middleware_1 = tslib_1.__importDefault(require("webpack-dev-middleware"));
const webpack_hot_middleware_1 = tslib_1.__importDefault(require("webpack-hot-middleware"));
const compilation_1 = require("./compilation");
const config_1 = require("../config");
const { architect: { build: { platform } } } = config_1.project;
const { outputPath } = platform.client || {};
exports.default = async (app) => {
    if (!config_1.existenceClient) {
        return Promise.resolve();
    }
    const client = (0, config_1.webpackDevClient)();
    const multiCompiler = (0, webpack_1.default)(client);
    const promise = (0, compilation_1.createCompilationPromise)('client', multiCompiler, client);
    app.use(express_1.default.static(outputPath));
    app.use((0, webpack_dev_middleware_1.default)(multiCompiler, {
        publicPath: client.output.publicPath.toString(),
    }));
    app.use((0, webpack_hot_middleware_1.default)(multiCompiler, { log: false }));
    if (!config_1.existenceServer) {
        app.use(async (request, response) => {
            response.sendStatus(404);
        });
    }
    return promise;
};
