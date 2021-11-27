import express from 'express';
import { project, existenceServer } from '../config';
import { hotServer } from './hot.server';
const { architect: { build: { platform } } } = project;
const { outputPath } = platform.server || {};
export default async (app) => {
    if (!existenceServer) {
        return Promise.resolve(null);
    }
    app.use(express.static(outputPath));
    return await hotServer(); // await nodemon();
};
