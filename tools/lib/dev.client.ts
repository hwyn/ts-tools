import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { createCompilationPromise } from './compilation';
import { webpackDevClient, runClient } from '../config';

export default async (app: any) => {
  if (!runClient) {
    return Promise.resolve();
  }
  const client = webpackDevClient();
  const multiCompiler = webpack(client);
  const promise = createCompilationPromise('client', multiCompiler, client);
  app.use(webpackDevMiddleware(multiCompiler, {
    publicPath: client.output.publicPath,
    logLevel: 'silent',
  }));

  app.use(webpackHotMiddleware(multiCompiler, { log: false }));

  return promise;
};
