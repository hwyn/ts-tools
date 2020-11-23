import webpack from 'webpack';
import express from 'express';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { createCompilationPromise } from './compilation';
import { webpackDevClient, existenceClient, project } from '../config';

const { architect: { build: { platform } } } = project;
const { options } = platform.client || {};

export default async (app: any) => {
  if (!existenceClient) {
    return Promise.resolve();
  }

  const client = webpackDevClient();
  const multiCompiler = webpack(client);
  const promise = createCompilationPromise('client', multiCompiler, client);

  app.use(express.static(options.outputPath));
  app.use(webpackDevMiddleware(multiCompiler, {
    publicPath: client.output.publicPath,
    logLevel: 'silent',
  }));

  app.use(webpackHotMiddleware(multiCompiler, { log: false }));

  return promise;
};
