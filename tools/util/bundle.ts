import webpack, { Configuration, Stats } from 'webpack';
import { webpackServer, webpackClient, webpackDll, webpackServerEntry } from '../config';

export function webpackRun(webpackconfig: Configuration | Configuration[], _stast?: any): Promise<any> {
  if (Array.isArray(webpackconfig)) {
    return Promise.all(webpackconfig.map((config: Configuration) => webpackRun(config, config.stats)));
  }
  return new Promise((resolve, reject) => {
    const isRun = Array.isArray(webpackconfig.entry) ? !!webpackconfig.entry.length : !!Object.keys(webpackconfig.entry).length;
    if (!isRun) {
      return resolve();
    }
    webpack(webpackconfig as Configuration).run((err, stats: Stats) => {
      if (err) {
        return reject();
      }
      console.info(stats.toString(webpackconfig.stats || _stast));
      resolve();
    });
  })
}

export default async (): Promise<any> => {
  return webpackRun(webpackDll()).then(() => webpackRun([
    webpackServerEntry(),
    webpackClient(),
    webpackServer(),
  ]));
};

