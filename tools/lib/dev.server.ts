import express from 'express';
import { project } from '../config';
import nodemon from './nodemon.server';

const { architect: { build: { platform } } } = project;
const { outputPath } = platform.server || {};

export default async (app: any) => {
  app.use(express.static(outputPath));
  return await nodemon();
};
