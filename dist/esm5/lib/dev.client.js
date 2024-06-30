import { __awaiter, __generator } from "tslib";
import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { createCompilationPromise } from './compilation';
import { webpackDevClient, existenceClient, existenceServer, project } from '../config';
var platform = project.architect.build.platform;
var outputPath = (platform.client || {}).outputPath;
var configurations = (platform.server || {}).configurations;
export default (function (app) { return __awaiter(void 0, void 0, void 0, function () {
    var client, multiCompiler, promise;
    return __generator(this, function (_a) {
        if (!existenceClient) {
            return [2 /*return*/, Promise.resolve()];
        }
        client = webpackDevClient();
        multiCompiler = webpack(client);
        promise = createCompilationPromise('client', multiCompiler, client);
        app.use(express.static(outputPath));
        app.use(webpackDevMiddleware(multiCompiler, {
            publicPath: client.output.publicPath.toString(),
        }));
        app.use(webpackHotMiddleware(multiCompiler, { log: false }));
        if (!existenceServer && !(configurations === null || configurations === void 0 ? void 0 : configurations.proxy)) {
            app.use(function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    response.sendStatus(404);
                    return [2 /*return*/];
                });
            }); });
        }
        return [2 /*return*/, promise];
    });
}); });
