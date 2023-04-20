import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { createCompilationPromise } from './compilation';
import { webpackDevClient, existenceClient, existenceServer, project } from '../config';
const { architect: { build: { platform } } } = project;
const { outputPath } = platform.client || {};
const { configurations } = platform.server || {};
export default async (app) => {
    if (!existenceClient) {
        return Promise.resolve();
    }
    const client = webpackDevClient();
    const multiCompiler = webpack(client);
    const promise = createCompilationPromise('client', multiCompiler, client);
    app.use(express.static(outputPath));
    app.use(webpackDevMiddleware(multiCompiler, {
        publicPath: client.output.publicPath.toString(),
    }));
    app.use(webpackHotMiddleware(multiCompiler, { log: false }));
    if (!existenceServer && !configurations?.proxy) {
        app.use(async (request, response) => {
            response.sendStatus(404);
        });
    }
    return promise;
};
