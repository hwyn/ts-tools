import webpack, { Configuration, Stats } from 'webpack';
import { webpackServer, webpackClient, webpackDll, webpackServerEntry } from '../config';

export const isRun = (webpackconfig: Configuration) => {
  return Array.isArray(webpackconfig.entry) ? !!webpackconfig.entry.length : !!Object.keys(webpackconfig.entry).length;
}

export function webpackRun(webpackconfig: Configuration | Configuration[], _stast?: any): Promise<any> {
  if (Array.isArray(webpackconfig)) {
    return Promise.all(webpackconfig.map((config: Configuration) => webpackRun(config, config.stats)));
  }
  return new Promise((resolve, reject) => {
    if (!isRun(webpackconfig)) {
      return resolve();
    }
    const multiCompiler =  webpack(webpackconfig as Configuration);
    multiCompiler.run((err, stats: Stats) => {
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
  ])).then(() => webpackRun(webpackServer()));
};

