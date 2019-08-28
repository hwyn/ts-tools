import path from 'path';
import express from 'express';
import { webpackServer } from '../config';
import { config } from '../config';
import nodemon from './nodemon.server';

const { buildDir } = config;

export default async (app: any) => {
  const config = webpackServer();
  const entryFile = (config as any).entryFile || 'server/index.ts';
  app.use(express.static(path.resolve(buildDir, '/public')));
  return await nodemon(app, entryFile);
};
