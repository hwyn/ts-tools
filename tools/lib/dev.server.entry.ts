import webpack from 'webpack';
import { webpackRun, isRun } from '../util/bundle';
import { webpackDevServerEntry } from '../config';
import { createCompilationPromise } from './compilation';

export default async (app?: any): Promise<any> => {
  const config = webpackDevServerEntry();
  if (!isRun(config)) {
    return Promise.resolve();
  } 
  const multiCompiler = webpack(config);
  const promise = createCompilationPromise('server-entry', multiCompiler, config);
  multiCompiler.watch({
    aggregateTimeout: 300,
  }, () => {});
  return promise;
  // return webpackRun(config, config.stats);
};
