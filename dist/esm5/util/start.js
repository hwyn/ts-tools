import { __assign, __awaiter, __generator } from "tslib";
import browserSync from 'browser-sync';
import express from 'express';
import { existenceClient } from '../config';
import clientHotDev from '../lib/dev.client';
import dllDev from '../lib/dev.dll';
import serverHotDev from '../lib/dev.server';
import serverEntryHotDev from '../lib/dev.server.entry';
import cleanDir from './clean';
var app = express();
export default (function () { return __awaiter(void 0, void 0, void 0, function () {
    var host;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, cleanDir()];
            case 1:
                _a.sent();
                return [4 /*yield*/, dllDev()];
            case 2:
                _a.sent();
                return [4 /*yield*/, clientHotDev(app)];
            case 3:
                _a.sent();
                return [4 /*yield*/, serverEntryHotDev()];
            case 4:
                _a.sent();
                return [4 /*yield*/, serverHotDev(app)];
            case 5:
                host = _a.sent();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        existenceClient ? browserSync.create().init(__assign({ ui: false, middleware: app }, host ? { proxy: { target: host } } : { server: true }), function (error, bs) { return error ? reject(error) : resolve(bs); }) : Promise.resolve();
                    })];
        }
    });
}); });
