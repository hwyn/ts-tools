import webpack, { Configuration } from 'webpack';
import { webpackServer, webpackClient, config } from './config';

export default async (): Promise<any> => {
  const client = webpackClient();
  return new Promise((resolve, reject) => {
    webpack([client, webpackServer()]).run((err, stats) => {
      if (err) {
        return reject();
      }
      console.info(stats.toString(client.stats));
      resolve();
    }); 
  });
};
