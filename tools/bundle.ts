import webpack, { Configuration, Stats } from 'webpack';
import { webpackServer, webpackClient, webpackDll, config } from './config';

export function webpackRun(webpackconfig: Configuration | Configuration[], _stast?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    webpack(webpackconfig as Configuration).run((err, stats: Stats) => {
      if (err) {
        return reject();
      }
      console.info(stats.toString(_stast));
      resolve();
    });
  })
}


export default async (): Promise<any> => {
  const dll = webpackDll();
  const isCanDll = Array.isArray(dll.entry) ? !!dll.entry.length : !!Object.keys(dll.entry).length;
  return (isCanDll ? webpackRun(dll, dll.stats) : Promise.resolve()).then(() =>{
    const client = webpackClient();
    return webpackRun([client, webpackServer()], client.stats);
  });
};
