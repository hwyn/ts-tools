import { webpackRun } from '../util/bundle';
import { webpackDevServerEntry } from '../config';

export default async (app?: any): Promise<any> => {
  const config = webpackDevServerEntry();
  return webpackRun(config, config.stats);
};
