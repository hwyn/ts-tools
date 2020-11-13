import express from 'express';
import path from 'path';
import browserSync from 'browser-sync';
import { buildDir, runClient, config } from '../config';
import cleanDir from './clean';
import serverHotDev from '../lib/dev.server';
import clientHotDev from '../lib/dev.client';
import serverEntryHotDev from '../lib/dev.server.entry';
import dllDev from '../lib/dev.dll';
console.log(config);
const app = express();
app.use(express.static(path.join(buildDir, 'public')));

export default async (): Promise<any> => {
  await cleanDir();
  await dllDev();
  await clientHotDev(app);
  await serverEntryHotDev();
  const host = await serverHotDev(app);
  return new Promise((resolve, reject) => {
    runClient ? browserSync.create().init({
      ui: false,
      proxy: {
        target: host,
        middleware: app,
      },
    }, (error, bs) => error ? reject(error) : resolve(bs)) : Promise.resolve();
  });
}
