import { webpackRun } from '../util/bundle';
import { webpackDevServerEntry } from '../config';
import { resolve } from 'path';

export default async (app?: any): Promise<any> => {
  const config = webpackDevServerEntry();
  const isCanServerEntry = Array.isArray(config.entry) ? !!config.entry.length : !!Object.keys(config.entry).length;
  if (isCanServerEntry) {
    return webpackRun(config, config.stats);
  }
  return Promise.resolve();
};
