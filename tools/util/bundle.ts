import { isEmpty } from 'lodash';
import webpack, { Configuration, Stats } from 'webpack';
import { webpackServer, webpackClient, webpackDll, webpackServerEntry } from '../config';
import { existenceClient } from '../config'

export const isRun = (webpackconfig: Configuration) => {
  return !isEmpty(webpackconfig.entry);
}

export function webpackRun(webpackconfig: Configuration | Configuration[], _stast?: any): Promise<any> {
  if (Array.isArray(webpackconfig)) {
    return Promise.all(webpackconfig.map((config: Configuration) => webpackRun(config, config.stats)));
  }
  return new Promise((resolve, reject) => {
    if (!isRun(webpackconfig)) {
      return resolve(null);
    }
    const multiCompiler =  webpack(webpackconfig as Configuration);
    multiCompiler.run((err, stats: Stats) => {
      if (err) {
        console.log('-------------', err);
        return reject();
      }
      console.info(stats.toString(webpackconfig.stats || _stast));
      resolve(null);
    });
  })
}

export default async (): Promise<any> => {
  return webpackRun(webpackDll()).then(() => webpackRun([
    webpackServerEntry(),
    ...existenceClient ? [ webpackClient() ]: [],
  ])).then(() => webpackRun(webpackServer()));
};

