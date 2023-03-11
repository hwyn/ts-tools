import express from 'express';
import { project, existenceServer } from '../config';
import { hotServer } from './hot.server';
import nodemon from './nodemon.server';
const { architect: { build: { platform } = {} } } = project;
const { outputPath, configurations } = platform?.server || {};
export default async (app) => {
    if (!existenceServer) {
        return Promise.resolve(configurations?.proxy);
    }
    outputPath && app.use(express.static(outputPath));
    return configurations?.isNodemon ? await nodemon() : await hotServer();
};
