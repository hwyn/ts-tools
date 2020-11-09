import path from 'path';
import express from 'express';
import { buildDir } from '../config';
import nodemon from './nodemon.server';

export default async (app: any) => {
  app.use(express.static(path.resolve(buildDir, '/public')));
  return await nodemon();
};
