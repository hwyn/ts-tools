"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var webpack_1 = tslib_1.__importDefault(require("webpack"));
var express_1 = tslib_1.__importDefault(require("express"));
var webpack_dev_middleware_1 = tslib_1.__importDefault(require("webpack-dev-middleware"));
var webpack_hot_middleware_1 = tslib_1.__importDefault(require("webpack-hot-middleware"));
var compilation_1 = require("./compilation");
var config_1 = require("../config");
var platform = config_1.project.architect.build.platform;
var outputPath = (platform.client || {}).outputPath;
var configurations = (platform.server || {}).configurations;
exports.default = (function (app) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    var client, multiCompiler, promise;
    return tslib_1.__generator(this, function (_a) {
        if (!config_1.existenceClient) {
            return [2 /*return*/, Promise.resolve()];
        }
        client = (0, config_1.webpackDevClient)();
        multiCompiler = (0, webpack_1.default)(client);
        promise = (0, compilation_1.createCompilationPromise)('client', multiCompiler, client);
        app.use(express_1.default.static(outputPath));
        app.use((0, webpack_dev_middleware_1.default)(multiCompiler, {
            publicPath: client.output.publicPath.toString(),
        }));
        app.use((0, webpack_hot_middleware_1.default)(multiCompiler, { log: false }));
        if (!config_1.existenceServer && !(configurations === null || configurations === void 0 ? void 0 : configurations.proxy)) {
            app.use(function (request, response) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    response.sendStatus(404);
                    return [2 /*return*/];
                });
            }); });
        }
        return [2 /*return*/, promise];
    });
}); });
