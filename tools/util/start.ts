import express from 'express';
import path from 'path';
import browserSync from 'browser-sync';
import { config } from '../config';
import cleanDir from './clean';
import serverHotDev from  '../lib/dev.server';
import clientHotDev from '../lib/dev.client';
import serverEntryHotDev from '../lib/dev.server.entry';
import dllDev from '../lib/dev.dll';

const { buildDir } = config;
const app = express();
export default async (): Promise<any> => {
  app.use(express.static(path.join(buildDir, 'public')));
  await cleanDir();
  await dllDev();
  await serverEntryHotDev(app);
  await clientHotDev(app);
  const host = await serverHotDev(app);
  return new Promise((resolve, reject) => {
    browserSync.create().init({
      ui: false,
      proxy: {
        target: host,
        middleware: app,
      },
    }, (error, bs) => error ? reject(error): resolve(bs));
  });
}
