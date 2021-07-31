import express from 'express';
import { project } from '../config';
import { hotServer } from './hot.server';

const { architect: { build: { platform } } } = project;
const { outputPath } = platform.server || {};

export default async (app: any): Promise<string> => {
  app.use(express.static(outputPath));
  return await hotServer(); // await nodemon();
};
