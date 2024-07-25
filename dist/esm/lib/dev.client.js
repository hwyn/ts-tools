import { __awaiter } from "tslib";
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { existenceClient, existenceServer, project, webpackDevClient } from '../config';
import { createCompilationPromise } from './compilation';
const { architect: { build: { platform } } } = project;
const { outputPath } = platform.client || {};
const { configurations } = platform.server || {};
export default (app) => __awaiter(void 0, void 0, void 0, function* () {
    if (!existenceClient) {
        return Promise.resolve();
    }
    const client = yield webpackDevClient();
    const multiCompiler = webpack(client);
    const promise = createCompilationPromise('client', multiCompiler, client);
    app.use(express.static(outputPath));
    app.use(webpackDevMiddleware(multiCompiler, {
        publicPath: client.output.publicPath.toString(),
    }));
    app.use(webpackHotMiddleware(multiCompiler, { log: false }));
    if (!existenceServer && !(configurations === null || configurations === void 0 ? void 0 : configurations.proxy)) {
        app.use((request, response) => __awaiter(void 0, void 0, void 0, function* () {
            response.sendStatus(404);
        }));
    }
    return promise;
});
