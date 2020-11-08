import webpack from 'webpack';
import { isRun } from '../util/bundle';
import { webpackDevServerEntry } from '../config';
import { createCompilationPromise } from './compilation';

export default async (): Promise<any> => {
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
};
