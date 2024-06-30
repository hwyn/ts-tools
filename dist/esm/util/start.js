import { __awaiter } from "tslib";
import express from 'express';
import browserSync from 'browser-sync';
import { existenceClient } from '../config';
import cleanDir from './clean';
import serverHotDev from '../lib/dev.server';
import clientHotDev from '../lib/dev.client';
import serverEntryHotDev from '../lib/dev.server.entry';
import dllDev from '../lib/dev.dll';
const app = express();
export default () => __awaiter(void 0, void 0, void 0, function* () {
    yield cleanDir();
    yield dllDev();
    yield clientHotDev(app);
    yield serverEntryHotDev();
    const host = yield serverHotDev(app);
    return new Promise((resolve, reject) => {
        existenceClient ? browserSync.create().init(Object.assign({ ui: false, middleware: app }, host ? { proxy: { target: host } } : { server: true }), (error, bs) => error ? reject(error) : resolve(bs)) : Promise.resolve();
    });
});
