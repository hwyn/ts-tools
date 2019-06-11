import path from 'path';
import express from 'express';
import { config } from '../config';
import nodemon from './nodemon.server';

const { buildDir } = config;

export default async (app: any) => {
  app.use(express.static(path.resolve(buildDir, '/public')));
  return await nodemon(app);
};
