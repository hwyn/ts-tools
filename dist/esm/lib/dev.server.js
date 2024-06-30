import { __awaiter } from "tslib";
import express from 'express';
import { project, existenceServer } from '../config';
import { hotServer } from './hot.server';
// import nodemon from './nodemon.server';
const { architect: { build: { platform } = {} } } = project;
const { outputPath, configurations } = (platform === null || platform === void 0 ? void 0 : platform.server) || {};
export default (app) => __awaiter(void 0, void 0, void 0, function* () {
    if (!existenceServer) {
        return Promise.resolve(configurations === null || configurations === void 0 ? void 0 : configurations.proxy);
    }
    outputPath && app.use(express.static(outputPath));
    return yield hotServer();
    // return configurations?.isNodemon ? await nodemon() : await hotServer();
});
