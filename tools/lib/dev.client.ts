import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { createCompilationPromise } from './compilation';
import { webpackDevClient } from '../config';

export default async (app: any) => {
  const config = webpackDevClient();
  const multiCompiler = webpack(config);
  const promise = createCompilationPromise('client', multiCompiler, config);
  app.use(webpackDevMiddleware(multiCompiler, {
    publicPath: config.output.publicPath,
    logLevel: 'silent',
  }));

  app.use(webpackHotMiddleware(multiCompiler, {
    log: false,
  }));

  return promise;
};
